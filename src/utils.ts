import moment from "moment";

export function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getDateString=(dateString:string)=>{
    return moment(dateString).format('MMM YYYY');
}

export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });