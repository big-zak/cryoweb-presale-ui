import { BigNumber } from "@ethersproject/bignumber";
import appConfig from "../config/app";

export default { 
    install(app, options) {

        let _globals = app.config.globalProperties;


        _globals.toHumanReadable = (amount) => {
            let tokenDecimal = appConfig.tokenDecimal;

            let divisor = BigNumber.from(10).pow(BigNumber.from(tokenDecimal.toString()));

            return BigNumber.from(amount).div(divisor);
        }

        _globals.toMoneyValue = (num) => {
            let amount = num.replace(/(\d)(?=(\d{3})+\b)/g, "$1,");
			return amount;
        }

    }

}