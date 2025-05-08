// app/coupons/new/page.tsx (Server Component)
import Link from 'next/link';
import CouponForm from '../components/CouponForm';

export default function NewCouponPage() {
    return (
        <div className="max-w-4xl mx-auto pb-30 ">
          

            <div className="">
                <CouponForm />
            </div>
        </div>
    );
}