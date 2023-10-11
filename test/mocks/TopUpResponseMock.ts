export default class TopUpResponseMock {
  data

  constructor () {
    this.data = {
      id: '65236d11a10e361015eb64ee',
      external_id: 'efeab4b8-d35d-4726-ac84-d2b3b9054646',
      user_id: '623d6fab71d1135c3eb173e5',
      status: 'PENDING',
      merchant_name: 'Jajanmania',
      merchant_profile_picture_url: 'https://xnd-merchant-logos.s3.amazonaws.com/business/production/623d6fab71d1135c3eb173e5-1663950863091.png',
      amount: 20000,
      payer_email: 'da861b74-1366-4e4a-aa3c-a982de2026fa@mail.com',
      expiry_date: '2023-10-10T03:01:37.853Z',
      invoice_url: 'https://checkout-staging.xendit.co/v2/65236d11a10e361015eb64ee',
      available_banks: [
        {
          bank_code: 'MANDIRI',
          collection_type: 'POOL',
          transfer_amount: 20000,
          bank_branch: 'Virtual Account',
          account_holder_name: 'SPORTAL',
          identity_amount: 0
        },
        {
          bank_code: 'BRI',
          collection_type: 'POOL',
          transfer_amount: 20000,
          bank_branch: 'Virtual Account',
          account_holder_name: 'SPORTAL',
          identity_amount: 0
        },
        {
          bank_code: 'BNI',
          collection_type: 'POOL',
          transfer_amount: 20000,
          bank_branch: 'Virtual Account',
          account_holder_name: 'SPORTAL',
          identity_amount: 0
        },
        {
          bank_code: 'PERMATA',
          collection_type: 'POOL',
          transfer_amount: 20000,
          bank_branch: 'Virtual Account',
          account_holder_name: 'SPORTAL',
          identity_amount: 0
        },
        {
          bank_code: 'BCA',
          collection_type: 'POOL',
          transfer_amount: 20000,
          bank_branch: 'Virtual Account',
          account_holder_name: 'SPORTAL',
          identity_amount: 0
        }
      ],
      available_retail_outlets: [
        { retail_outlet_name: 'ALFAMART' },
        { retail_outlet_name: 'INDOMARET' }
      ],
      available_ewallets: [
        { ewallet_type: 'OVO' },
        { ewallet_type: 'DANA' },
        { ewallet_type: 'SHOPEEPAY' },
        { ewallet_type: 'LINKAJA' }
      ],
      available_qr_codes: [{ qr_code_type: 'QRIS' }],
      available_direct_debits: [{ direct_debit_type: 'DD_BRI' }],
      available_paylaters: [],
      should_exclude_credit_card: false,
      should_send_email: false,
      created: '2023-10-09T03:01:38.483Z',
      updated: '2023-10-09T03:01:38.483Z',
      currency: 'IDR',
      customer: {
        given_names: 'fulName0',
        email: 'da861b74-1366-4e4a-aa3c-a982de2026fa@mail.com'
      }
    }
  }
}
