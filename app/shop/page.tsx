import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { Store, MapPin, ChevronRight, Instagram } from 'lucide-react';
import { getServerLocale } from '@/lib/locale-server';
import { getMessage } from '@/lib/translations';

// دالة لجلب صور انستغرام لكل حانوت بشكل مستقل
async function getShopInstagramPhotos(shop: any) {
  if (!shop.ig_access_token || !shop.ig_user_id) return [];
  
  try {
    const mediaUrl = `https://graph.facebook.com/v19.0/${shop.ig_user_id}/media?fields=media_url,permalink&access_token=${shop.ig_access_token}&limit=3`;
    const res = await fetch(mediaUrl, { next: { revalidate: 3600 } }); // كاش لمدة ساعة
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export default async function AllShopsPage() {
  const locale = await getServerLocale();
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  // 1. جلب كاع المحلات
  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. جلب صور انستغرام لكل المحلات في وقت واحد (Parallel)
  const shopsWithPhotos = await Promise.all(
    (shops || []).map(async (shop) => {
      const igPhotos = await getShopInstagramPhotos(shop);
      return { ...shop, igPhotos };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans">
      <header className="bg-white border-b border-gray-100 p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-orange-500 font-bold text-2xl italic">SoukElHad.ma</span>
          </Link>
          <h1 className="text-gray-500 font-medium hidden sm:block">دليل تجار سوق الأحد</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4 uppercase italic">المحلات المسجلة</h2>
          <p className="text-gray-500">اكتشف جديد السلع مباشرة من انستغرام تجار سوق الأحد</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shopsWithPhotos.map((shop) => (
            <div key={shop.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              {/* معلومات الحانوت */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 relative rounded-2xl overflow-hidden bg-orange-50 shrink-0">
                    {shop.photo_url ? (
                      <Image src={shop.photo_url} alt={shop.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-orange-200"><Store /></div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-black text-xl text-gray-900 leading-tight uppercase italic">{shop.name}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                      <MapPin size={14} /> <span>رقم المحل: {shop.box_number || '---'}</span>
                    </div>
                  </div>
                </div>

                {/* صور انستغرام (أخر 3) */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {shop.igPhotos.length > 0 ? (
                    shop.igPhotos.map((img: any) => (
                      <div key={img.id} className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
                        <Image src={img.media_url} alt="instagram" fill className="object-cover hover:scale-110 transition-transform" />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 text-xs italic">
                      {shop.ig_access_token ? "في انتظار الصور..." : "لا يوجد انستغرام مفعل"}
                    </div>
                  )}
                </div>

                <Link 
                  href={`/shop/${shop.slug}`}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-orange-500 transition-colors"
                >
                  زيارة المحل <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
