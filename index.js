const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')


var accounts = JSON.parse(fs.readFileSync('accounts.json', 'utf-8'));


function projetoAccounts(){
    inquirer.prompt([
        {
            type:"list",
            name: "operation",
            message: "Qual operação deseja fazer?",
            choices: [
                {
                    value: "Criar conta"
                },
                {
                    value: "Consultar saldo"
                },
                {
                    value: "Depositar"
                },
                {
                    value: "Sacar"
                },
                {
                    value: "Sair"
                }
            ]
        }
    ]).then(answers=>{
        let operation = answers.operation
        switch(operation){
            case "Criar conta":
                inquirer.prompt([
                    {
                        name: "account",
                        message: "Qual o nome da conta que deseja criar?"
                    }
                ]).then(ans=>{
                    let accountFound = accounts.find(element=>element.nome===ans.account)
                    if(!accountFound){
                        accounts.push({
                            nome: ans.account,
                            saldo: 0
                        })
                        fs.writeFile('accounts.json', JSON.stringify(accounts), (err)=>{
                            if(!err){
                                console.log(chalk.bgGreen("Conta criada com sucesso!"))
                                console.log("\n")
                            }else{
                                console.log(chalk.bgRed.white("Não foi possível criar sua conta."))
                                console.log("\n")
                            }
                            projetoAccounts()
                        })
                    }else{
                        console.log(console.log(chalk.bgRed.white("Conta já existente.")))
                        console.log("\n")
                        projetoAccounts()
                    }
                })
                break;
            case "Consultar saldo":
                inquirer.prompt([
                    {
                        name: "account",
                        message: "Qual a conta em que deseja consultar saldo?"
                    }
                ]).then(ans=>{
                    let accountFound = accounts.find(element=>element.nome===ans.account)
                    if(!accountFound){
                        console.log(chalk.bgRed.white('Conta Inexistente!'))
                        console.log("\n")
                    }else{
                        console.log(`Saldo da conta: ${accountFound.saldo}`)
                        console.log("\n")
                    }
                    projetoAccounts()
                })
                break;
            case "Depositar":
                inquirer.prompt([
                    {
                        name: "account",
                        message: "Qual a conta em que deseja depositar?"
                    }
                ]).then(ans=>{
                    var accountFound = accounts.find(element=>element.nome===ans.account)
                    if(!accountFound){
                        console.log(chalk.bgRed.white('Conta Inexistente!'))
                        console.log("\n")
                        projetoAccounts()
                    }else{
                        inquirer.prompt([
                            {
                                name: "deposit",
                                message: "Quanto deseja depositar?"
                            }
                        ]).then(ans=>{
                            let index = accounts.findIndex(account=>account===accountFound)
                            accounts[index].saldo+=parseFloat(ans.deposit)
                            fs.writeFile('accounts.json', JSON.stringify(accounts), (err)=>{
                               if(err){
                                console.log(chalk.bgRed.white("Ocorreu um erro ao processar o depósito."))
                                console.log("\n")
                               }else{
                                console.log(chalk.bgGreen(`Depósito realizado com sucesso. Valor: ${ans.deposit}`))
                                console.log("\n")
                               }
                               projetoAccounts()
                            })
                        }).catch(()=>{
                            console.log(chalk.bgRed.white("Ocorreu um erro ao processar o depósito."))
                            console.log("\n")
                            projetoAccounts()
                        })
                    }
                })
                break;
            case "Sacar":
                inquirer.prompt([
                    {
                        name: "account",
                        message: "Qual a conta em que deseja sacar?"
                    }
                ]).then(ans=>{
                    var accountFound = accounts.find(element=>element.nome===ans.account)
                    if(!accountFound){
                        console.log(chalk.bgRed.white('Conta Inexistente!'))
                        console.log("\n")
                        projetoAccounts()
                    }else{
                        inquirer.prompt([
                            {
                                name: "deposit",
                                message: "Quanto deseja sacar?"
                            }
                        ]).then(ans=>{
                            let index = accounts.findIndex(account=>account===accountFound)
                            accounts[index].saldo-=parseFloat(ans.deposit)
                            fs.writeFile('accounts.json', JSON.stringify(accounts), (err)=>{
                               if(err){
                                console.log(chalk.bgRed.white("Ocorreu um erro ao processar o saque."))
                               }else{
                                console.log(chalk.bgGreen(`Saque realizado com sucesso. Valor: ${ans.deposit}`))
                               }
                               console.log("\n")
                               projetoAccounts()
                            })
                        }).catch(()=>{
                            console.log(chalk.bgRed.white("Ocorreu um erro ao processar o saque."))
                            console.log("\n")
                            projetoAccounts()
                        })
                    }
                })
            case "Sair":
                break;
        }
    })
}

projetoAccounts()