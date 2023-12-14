const ci = require('miniprogram-ci') //微信小程序的编译模块
const {program} = require('commander')//nodejs命令行界面工具
const inquirer = require('inquirer')//交互式命令行提示器

const {appid} = require('../project.config.json') //小程序appid信息获取,需匹配项目路径

    //cwd: 当前node命令执行的文件夹 是固定的 
    //__dirname:当前模块即js文件的文件夹 是随文件不同而变化
    const rootPath = process.cwd()
    const project = new ci.Project({
        appid,
        type:'miniProgram',
        projectPath:rootPath +'/min-program', //小程序项目包
        privateKeyPath:rootPath +'/config/private.wx358f168a69294090.key',//小程序私钥,微信公众平台获取
        ignores: ['node_modules/**/*']
    })
    async function uploadByCi({version,desc = ''} ={}){
        const uploadResult= await ci.upload({
            project,
            version,
            desc,
            setting:{
                es6:true,
                es7:true,
                minify:true,
                autoPrefixWXSS:true
            },
            onProgressUpdate:console.log
        })
        console.log('uploadResult',uploadResult)
        return uploadResult
    };
    const uploadPrompts = [
        {
            type:'input',
            name:'version',
            message:'无需修改请直接按回车键\n请输入上传的版本号',
            default:'1.0.0',
            validate(v){
                if(!/^\d\.\d\.\d$/.test(v)){
                    return '版本号格式不正确,示例:1.0.0'
                }else{
                    return true
                }
            }
        },
        {
            type:'input',
            name:'desc',
            message:'请输入版本描述',
        }
    ]
    const previewByCi = async ({desc = '',pagePath = '',searchQuery='',scene=''} = {})=>{
        const previewResult = await ci.preview({
            project,
            desc,
            setting:{
                es6:true
            },
            qrcodeFormat:'image',
            qrcodeOutputDest:`${rootPath}/config/preview.png`,
            pagePath,
            searchQuery,
            scene

        })
        console.log('previewResult',previewResult)
    }
    const previewPrompts = [
        {
            type:'input',
            name:'pagePath',
            message:'无需修改请直接按回车键\n请输入预览页面路径',
            default:'pages/index/index',
        },
        {
            type:'input',
            name:'searchQuery',
            message:"请输入预览页面启动参数",
        },
        {
            type:'number',
            name:'scene',
            message:'请输入预览场景值',
        }
    ]

    program.version('0.0.1');
    program
        .usage('<command> [options]')
        .command('upload')
        .option('-v, --version <version>','上传版本号')
        .option('-d, --desc <desc>','版本备注')
        .description('upload miniprogram')
        .action(async (options) => {
            const params = await inquirer.prompt(uploadPrompts)
            const {version,desc} = params
            const res = await uploadByCi({version,desc})
        });

    program
        .usage('<command> [options]')
        .command('preview')
        .option('-d, --desc <desc>','预览备注')
        .description('upload miniprogram')
        .action(async (options) => {
            const params = await inquirer.prompt(previewPrompts)
            const res = await previewByCi(params)
        });
    program.parse(process.argv);
    