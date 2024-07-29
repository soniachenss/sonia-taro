import decimal from './decimal'
export default
function formatMoney(number, decimalPlaces, moneySymbol, thousand, decimalSymbol, getNumber) {
      number = String(number).replace(/[^\d\.-]/g, '') || '0';
      decimalPlaces = !isNaN(decimalPlaces = Math.abs(decimalPlaces)) ? decimalPlaces : 2;
      moneySymbol = moneySymbol ? moneySymbol : "";
      thousand = thousand || ",";
      decimalSymbol = decimalSymbol || ".";
    //   getNumber = getNumber !== undefined ? getNumber : true
      let negative = number < 0 ? "-" : ""
      number = number < 0 ? number.substr(1) : number
      const numberStrArr = number.split('.')
      // let i = parseInt(number = Math.abs(+number || 0).toFixed(decimalPlaces), 10) + ""
      let i = parseInt(Number(numberStrArr[0]), 10) + ""
      let j = i.length
      j = j > 3 ? j % 3 : 0;
      // return moneySymbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (decimalPlaces && numberStrArr[1] ? decimalSymbol + Math.abs(`0.${numberStrArr[1]}`).toFixed(decimalPlaces).slice(2) : ""); //不满足输入框输入整数失焦后补全小数位
      return moneySymbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (decimalPlaces ? decimalSymbol + decimal(Math.abs(number - i),decimalPlaces,true).slice(2) : "");
  }
