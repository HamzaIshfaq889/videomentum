import { NextRequest, NextResponse } from 'next/server';

const FETCH_SIZE = 8192; // 8KB

/**
 * Find the offset of the 'moov' box in a buffer by searching for the signature
 */
function findMoovBoxOffset(buffer: ArrayBuffer): number | null {
  const view = new DataView(buffer);
  const signature = [0x6D, 0x6F, 0x6F, 0x76]; // 'moov' in bytes
  
  // Search for 'moov' signature (it appears at offset+4 in a box)
  for (let i = 0; i < buffer.byteLength - 8; i++) {
    if (
      view.getUint8(i) === signature[0] &&
      view.getUint8(i + 1) === signature[1] &&
      view.getUint8(i + 2) === signature[2] &&
      view.getUint8(i + 3) === signature[3]
    ) {
      // Found 'moov' signature, the box starts 4 bytes before (where size is)
      const boxStart = i - 4;
      if (boxStart >= 0) {
        console.log('🎯 Found moov signature at offset:', i, '(box starts at', boxStart, ')');
        return boxStart;
      }
    }
  }
  
  return null;
}

/**
 * Parse MP4 box/atom structure to extract duration
 */
function parseMp4Duration(buffer: ArrayBuffer, startOffset: number = 0): number | null {
  try {
    const view = new DataView(buffer);
    let offset = startOffset;

    console.log('🔍 Parsing MP4 structure, buffer size:', buffer.byteLength, 'starting at offset:', startOffset);

    // Look for 'moov' box (movie metadata container)
    while (offset < buffer.byteLength - 8) {
      const boxSize = view.getUint32(offset, false);
      const boxType = String.fromCharCode(
        view.getUint8(offset + 4),
        view.getUint8(offset + 5),
        view.getUint8(offset + 6),
        view.getUint8(offset + 7)
      );

      console.log(`📦 Found box: ${boxType}, size: ${boxSize}, offset: ${offset}`);

      if (boxType === 'moov') {
        console.log('✅ Found moov box, searching for mvhd...');
        // Found moov, now look for 'mvhd' (movie header) inside it
        let moovOffset = offset + 8;
        const moovEnd = offset + boxSize;

        while (moovOffset < moovEnd && moovOffset < buffer.byteLength - 8) {
          const innerSize = view.getUint32(moovOffset, false);
          const innerType = String.fromCharCode(
            view.getUint8(moovOffset + 4),
            view.getUint8(moovOffset + 5),
            view.getUint8(moovOffset + 6),
            view.getUint8(moovOffset + 7)
          );

          console.log(`  📦 Found inner box: ${innerType}, size: ${innerSize}`);

          if (innerType === 'mvhd') {
            console.log('✅ Found mvhd box, extracting duration...');
            // Found mvhd - movie header box
            const version = view.getUint8(moovOffset + 8);
            console.log('  Version:', version);
            
            if (version === 0) {
              // Version 0: 32-bit values
              const timescale = view.getUint32(moovOffset + 20, false);
              const duration = view.getUint32(moovOffset + 24, false);
              console.log('  ✅ Version 0 - Timescale:', timescale, 'Duration:', duration);
              return duration / timescale;
            } else if (version === 1) {
              // Version 1: 64-bit values
              const timescale = view.getUint32(moovOffset + 28, false);
              const durationLow = view.getUint32(moovOffset + 36, false);
              console.log('  ✅ Version 1 - Timescale:', timescale, 'Duration:', durationLow);
              return durationLow / timescale;
            }
          }

          moovOffset += innerSize;
        }
      }

      if (boxSize === 0) break;
      offset += boxSize;
    }

    console.warn('⚠️ moov or mvhd box not found in buffer');
    return null;
  } catch (error) {
    console.error('❌ Failed to parse MP4 duration:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }

    console.log('📹 Fetching metadata for:', videoUrl);

    // Fetch first 8KB of video with Range header
    const response = await fetch(videoUrl, {
      method: 'GET',
      headers: {
        'Range': `bytes=0-${FETCH_SIZE - 1}`,
      },
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', {
      contentRange: response.headers.get('Content-Range'),
      contentLength: response.headers.get('Content-Length'),
      contentType: response.headers.get('Content-Type'),
    });

    if (!response.ok && response.status !== 206) {
      console.error('❌ Failed to fetch video:', {
        status: response.status,
        statusText: response.statusText,
        url: videoUrl,
      });
      return NextResponse.json(
        { error: 'Failed to fetch video', status: response.status },
        { status: 500 }
      );
    }

    // Get file size from headers
    let fileSize: number | null = null;
    
    const contentRange = response.headers.get('Content-Range');
    if (contentRange) {
      const match = contentRange.match(/\/(\d+)$/);
      if (match) {
        fileSize = parseInt(match[1], 10);
      }
    }
    
    if (!fileSize) {
      const contentLength = response.headers.get('Content-Length');
      if (contentLength) {
        fileSize = parseInt(contentLength, 10);
      }
    }

    if (!fileSize || fileSize === 0) {
      console.error('❌ Could not determine file size:', {
        contentRange,
        contentLength: response.headers.get('Content-Length'),
        url: videoUrl,
      });
      return NextResponse.json(
        { error: 'Could not determine file size' },
        { status: 500 }
      );
    }

    console.log('✅ File size:', fileSize, 'bytes');

    // Parse MP4 to get duration
    const arrayBuffer = await response.arrayBuffer();
    console.log('📦 Fetched buffer size:', arrayBuffer.byteLength, 'bytes');
    
    let duration = parseMp4Duration(arrayBuffer);

    // If moov not found in first 8KB, try fetching from the end of the file
    // (some videos have moov at the end: ftyp → mdat → moov structure)
    if (!duration || duration === 0) {
      console.log('⚠️ moov not in first 8KB, trying last 64KB of file...');
      
      const endFetchSize = 65536; // 64KB
      const startByte = Math.max(0, fileSize - endFetchSize);
      
      const endResponse = await fetch(videoUrl, {
        headers: {
          'Range': `bytes=${startByte}-${fileSize - 1}`,
        },
      });

      if (!endResponse.ok && endResponse.status !== 206) {
        console.error('❌ Failed to fetch end of file:', endResponse.status);
        return NextResponse.json(
          { error: 'Could not extract duration from MP4' },
          { status: 500 }
        );
      }

      const endArrayBuffer = await endResponse.arrayBuffer();
      console.log('📦 Fetched end buffer size:', endArrayBuffer.byteLength, 'bytes (from byte', startByte, ')');
      
      // Find the moov box in the buffer (it might start mid-box)
      const moovOffset = findMoovBoxOffset(endArrayBuffer);
      if (moovOffset !== null) {
        console.log('✅ Searching for mvhd from moov box at offset:', moovOffset);
        duration = parseMp4Duration(endArrayBuffer, moovOffset);
      } else {
        console.warn('⚠️ moov signature not found in last 64KB');
      }
    }

    if (!duration || duration === 0) {
      console.error('❌ Could not extract duration:', {
        duration,
        bufferSize: arrayBuffer.byteLength,
        url: videoUrl,
      });
      return NextResponse.json(
        { error: 'Could not extract duration' },
        { status: 500 }
      );
    }

    console.log('⏱️ Duration:', duration, 'seconds');

    // Calculate bitrate (Mbps)
    const bitrate = (fileSize * 8) / duration / 1000000;

    console.log('✅ Metadata extracted successfully:', {
      url: videoUrl,
      fileSize: `${(fileSize / 1024 / 1024).toFixed(2)} MB`,
      duration: `${duration.toFixed(2)}s`,
      bitrate: `${bitrate.toFixed(2)} Mbps`,
    });

    return NextResponse.json({
      fileSize,
      duration,
      bitrate,
      url: videoUrl,
    });
  } catch (error) {
    console.error('❌ Error fetching video metadata:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
