import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Vui lòng cung cấp URL' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      next: { revalidate: 3600 } // Cache kết quả 1 giờ để tránh request liên tục
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}, status: ${res.status}`);
    }

    const html = await res.text();

    // Regex cơ bản để lấy nội dung của thẻ meta
    const getMetaProperty = (htmlContent: string, property: string) => {
      const match = htmlContent.match(new RegExp(`<meta(?:\\s+[a-zA-Z0-9-:]+="[^"]*")*\\s+(?:property|name)="${property}"(?:\\s+[a-zA-Z0-9-:]+="[^"]*")*\\s+content="([^"]+)"`, 'i')) ||
                    htmlContent.match(new RegExp(`<meta(?:\\s+[a-zA-Z0-9-:]+="[^"]*")*\\s+content="([^"]+)"(?:\\s+[a-zA-Z0-9-:]+="[^"]*")*\\s+(?:property|name)="${property}"`, 'i'));
      
      return match ? match[1].replace(/&#[0-9]+;/g, (s) => String.fromCharCode(parseInt(s.match(/[0-9]+/)![0]))) : null;
    };

    let title = getMetaProperty(html, 'og:title') || getMetaProperty(html, 'twitter:title');
    if (!title) {
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      title = titleMatch ? titleMatch[1] : '';
    }

    let image = getMetaProperty(html, 'og:image') || getMetaProperty(html, 'twitter:image') || '';
    
    // Nếu ảnh là đường dẫn tương đối, chuyển nó thành tuyệt đối
    if (image && image.startsWith('/')) {
        const urlObj = new URL(url);
        image = `${urlObj.protocol}//${urlObj.host}${image}`;
    }

    const description = getMetaProperty(html, 'og:description') || getMetaProperty(html, 'description') || '';

    return NextResponse.json({ title, image, description });
  } catch (error) {
    console.error("Lỗi khi lấy link preview:", error);
    return NextResponse.json({ error: 'Lỗi khi trích xuất dữ liệu' }, { status: 500 });
  }
}
