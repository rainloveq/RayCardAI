import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentCancelPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="text-center animate-fade-in">
          <div className="card-elevated max-w-sm mx-auto">
            <div className="text-5xl mb-4">😅</div>
            <h1 className="text-2xl font-serif font-bold text-brown-600 mb-2">
              付款未完成
            </h1>
            <p className="text-brown-400 mb-6">
              付款已取消，你的帳戶沒有被扣除任何費用
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/buy-points" className="btn-primary text-center">
                重新選擇方案
              </Link>
              <Link href="/dashboard" className="btn-secondary text-center">
                返回主頁
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
