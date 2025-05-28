import { getUserId } from '@/helpers/userHelper';
import { getAllCoupons } from '../actions/couponActions';
import CouponsListClient from './CouponsListClient';

export default async function CouponsList({ query, currentPage }) {
    const couponsPerPage = 10;
    const { coupons, totalCount } = await getAllCoupons(query, currentPage, couponsPerPage);
    const userId = await getUserId();

    return (
        <CouponsListClient
            initialCoupons={coupons}
            totalCount={totalCount}
            currentPage={currentPage}
            userId={userId}
            couponsPerPage={couponsPerPage}
        />
    );
}
