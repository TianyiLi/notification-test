import webstomp from 'webstomp-client'
import push from 'push.js'

// let client = webstomp.client(`ws://${location.host}:61614/stomp`)
/**
 * 
 * @param {Element} target 
 */
function eleToggle (target) {
  return {
    show () {
      target.style.display = 'block'
    },
    hide () {
      target.style.display = 'none'
    }
  }
}

document.body.onload = function () {
  let ip = document.querySelector('#ip'),
    presetCtn = document.querySelector('.preset'),
    onTestCtn = document.querySelector('.on-test'),
    ipInput = document.querySelector('#ip-input'),
    testDropBtn = document.querySelector('#test-drop'),
    testDropInput = document.querySelector('#test-drop-input'),
    pushTest = document.querySelector('#test'),
    client = undefined

  ip.addEventListener('click', function () {
    let _v = ipInput.value
    client = webstomp.client(`ws://${_v}:61614/stomp`)
    client.connect('user', 'password', () => {
      client.subscribe('/topic/app', msg => {
        if (!msg.body) return;
        let data = JSON.parse(msg.body)
        if (data.e === 'dispense/after_failed') {
          push.create('出貨失敗', {
            body: `${midHandler(data, '出貨失敗').text} 於 ${new Date().toLocaleString()}`
          })
        }
      })

      eleToggle(presetCtn).hide()
      eleToggle(onTestCtn).show()
    }, error => {
      eleToggle(presetCtn).show()
      eleToggle(onTestCtn).hide()
      alert(error)
    })
  })

  pushTest.addEventListener('click', function () {
    push.create('這是測試')
  })

  testDropBtn.addEventListener('click', function () {
    let _v = testDropInput.value
    if (/\d/g.test(_v)) {
      fetch(`http://${ipInput.value}/app/rest/drop.php?pid=${_v}`)
        .then(res=>res.json())
        .then(res=>{
          console.log(res)
          push.create('發送成功')
        })
      }
  })
}

function messageControl (opts) {
  let arg = [];
  /**
   * 當有忽略的mid-key
   * @type {string[]}
   */
  for (let _i = 1; _i < arguments.length; _i++) {
    arg[_i - 1] = arguments[_i];
  }
  let mid = (opts && opts.arg && 'mid' in opts.arg) ? opts.arg.mid : undefined;

  if (mid === undefined || !(mid in ivm_default_text)) {
    if (opts instanceof Object && 'arg' in opts && 'msg' in opts.arg) {
      return opts.arg.msg;
    } else if (arg.length > 0) {
      return arg[0] || arg[1] || `Cannot find corresponding element with ${mid}`;
    }
    return (mid === undefined) ? 'Argument undefined' : `Cannot find corresponding element with ${mid}`;
  }
  let msg = ivm_default_text[mid];

  return msg;
}

const ivm_default_text = {
  "cash_not_enough": "[!:-1]零錢不足，請改用其他方式交易",

  "auth_failed": "[!:5]認證失敗",
  "bill_phno": "[:-1]電信帳單支付 電話號碼:",
  "create_order_failed": "[!:5]無法生成交易記錄",
  "dispense_failed": "[!:5]出貨失敗。\n請洽詢服務台人員或撥打螢幕下方之統一速邁客服電話。\nFailed. Please contact station staff.",
  "dispense-success": "[:5]出貨成功 請取出商品",
  "dispense-success-receipt": "[:5]出貨成功 請取出商品及收據",
  "dispense_ok": "[:5]出貨成功",
  "easycard-success-change": "[:-1]卡片餘額: ",
  "easycard-success-info": "[:-1]交易金額: ",
  "get_invoice_id_failed": "[!:5]無法取得發票號碼",
  "inbalance": "[!:5]餘額不足",
  "inq_prod_failed": "[!:5]查詢商品資訊失敗",
  "invoice-topic": "[:5]感謝您的使用",
  "invoice_printed": "[:5]發票、收據列印完成\nReceipt is printed.",
  "invoice_printing": "[:-1]發票、收據列印中",
  "no_avail_chan": "[!:5]找不到可出貨的貨道",
  "on_refund": "[:-1]出貨失敗，將進行退款動作",
  "payment-no-cash": "[:-1]本商品目前不接受現金，請點選悠遊卡支付\nElectronic payment only, please select easycard.",
  "payment-phone-pay-info": "[:-1]請開啟$var手機APP，將產出的支付QRcode對準QRcode掃描區。",
  "payment-phone-pay-title": "[:-1]請開啟$var手機APP，將產出的支付QRcode對準QRcode掃描區",
  "payment-with-cash": "[:-1]請直接投入現金，或點選下列支付方式\nPlease pay by cash, or select other payments below.",
  "payment_timeout": "[!:5]等待支付結果逾時",
  "payment_wait_creditcard": "[:-1]請將卡片貼近至感應區(或刷卡、插卡)",
  "payment_wait_easycardedc": "[:-1]請將卡片輕觸讀卡機，\n10 秒內感應失敗將回到主畫面。\nHold your card near the reader.",
  "payment_wait_easycard": "[:-1]請將卡片輕觸讀卡機，\n10 秒內感應失敗將回到主畫面。\nHold your card near the reader.",
  "payment_wait_ipass": "[:-1]請將卡片輕觸讀卡機，\n10 秒內感應失敗將回到主畫面\nHold your card near the reader.",
  "payment_wait_happycash": "[:-1]請將卡片靠上讀卡機",
  "printer_disabled": "[!:5]印表機失效",
  "printer_no_paper": "[!:12]目前印表機無紙，無法使用悠遊卡交易，請選再次點選商品使用投幣、紙鈔功能，謝謝",
  "processing": "[:-1]處理中 請稍後",
  "prod_oos": "[!:5]商品已售完",
  "product-board-dispensing": "[:-1]出貨中 請稍候\nPlease wait.",
  "q_input_unino": "[:15]是否輸入統一編號",
  "q_print_receipt": "[:-1]是否列印收據",
  "receipt-print-check": "[:-1]是否需要列印交易明細 ?",
  "receipt-print-done": "[:5]請取出發票",
  "receipt_printed": "[:5]發票、收據列印完成",
  "failed_to_print_receipt": "[!:5]明細列印失敗",
  "receipt_printing": "[:-1]發票、收據列印中",
  "refunded_failed": "[!:5]退款失敗",
  "refunded_success": "[:5]退款成功",
  "undeterm_chid": "[!:5]無法決定貨道代號",
  "undeterm_invoice_title": "[!:5]無法決定發票標題",
  "undeterm_order": "[!:5]無法得知點菜記錄",
  "undeterm_payment": "[!:5]無法得知支付記錄",
  "undeterm_qrtype": "[!:5]無法辨別QRCode型態",
  "undeterm_si": "[!:5]無法決定SI名稱",
  "unknown_actype": "[!:5]未知的QRCode型類",

  "easycardedc_failed": "[!:5]$var",

  "happycash_refund": "[:-1]請將happycash貼近下方讀卡機完成退款動作",
  "happycash_refund_failed_retry": "[:-1]退款失敗，請再次將happycash貼近下方讀卡機完成退款動作",
  "happycash_refund_failed_final": "[!:5]退款失敗，請持列印憑證前往門市辦理退款",
  "happycash_refunded": "[:5]退款成功",

  "creditcard_error": "[!:5]信用卡支付錯誤 錯誤代號0001",
  "creditcard_callbank": "[!:5]信用卡支付錯誤 錯誤代號0002",
  "creditcard_timeout": "[!:5]信用卡支付錯誤 錯誤代號0003",
  "creditcard_process_error": "[!:5]信用卡支付錯誤 錯誤代號0004",
  "creditcard_communication_error": "[!:5]信用卡支付錯誤 錯誤代號0005",
  "creditcard_user_terminate": "[!:5]信用卡支付錯誤 錯誤代號0006",

  "ipass_info": "[:10]$var",
  "ipass_failed": "[!:10]$var"
}

function midHandler (opts, defaultMsg) {
  let mid = (typeof opts === 'string' && opts in ivm_default_text) ? opts : ((opts instanceof Object && 'arg' in opts && 'mid' in opts.arg) ? opts.arg.mid : '');
  let regex = /^\[([^\]]+)\]/;
  let res = {
    /**
     * -1 : infinite, others meaning second
     */
    time: -1,
    isAlert: false,
    text: ''
  }

  if (mid in ivm_default_text) {
    let _text = ivm_default_text[mid]
    if (regex.test(_text)) {
      let reg_str = _text.match(regex)
      res.text = _text.replace(reg_str[0], '')
      res.isAlert = !!reg_str[1].split(':') && reg_str[1].split(':')[0] === '!' ? true : false
      res.time = !!reg_str[1].split(':') && reg_str[1].split(':')[1] ? reg_str[1].split(':')[1] : productboard_time;
    } else if (/^(!)/.test(_text)) {
      let reg_str = /^(!)/;
      res.text = _text.replace(reg_str, '')
      res.isAlert = true;
      res.time = productboard_time;
    } else {
      res.text = _text
    }
    if (/\$var/.test(res.text) && opts.arg && opts.arg.msg) {
      res.text = res.text.replace('$var', opts.arg.msg)
    }
  } else {
    let text = messageControl(opts, defaultMsg)
    if (text == '') return !1;
    res.text = text;
    if (/(error|fail|success)/.test(mid)) {
      res.time = 5
      res.isAlert = /(error|fail)/.test(mid)
    } else {
      if (/(失敗|錯誤|成功)/.test(text)) {
        res.isAlert = /(失敗|錯誤)/.test(text);
        res.time = 5;
      }
    }
  }
  // console.log(res.text)
  res.time = typeof res.time === 'number' ? res.time : parseInt(res.time)
  return res;
}
