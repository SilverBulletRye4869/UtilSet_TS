import * as readline from "readline"

export class SInput {
    static INT: string = "^-?\\d+$";
    static U_INT: string = "^\\d+$";
    static NUM: string = "^-?\\d+\\.?\\d*$";
    static U_NUM: string = "^\\d+\\.?\\d*$";

    static async prompt_s(msg: string, terms: string |string[] = [".*"]): Promise<string>{
        const reg: string = "^"+(typeof(terms) == "string" ? terms : terms.join("$|^")) +"$";

        while(true){
            const read = readline.createInterface({input: process.stdin, output: process.stdout});
            const getString: string =  await new Promise<string>((resolve) =>{
                read.question(msg, (ans)=>{
                    resolve(ans)
                    read.close();
                })
            })
            if(getString.match(reg)) return getString;
            console.error("入力エラーが発生しました。再度入力してください");
        }
    }
}