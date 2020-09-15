const inquirer = require("inquirer");
const fs = require("fs");
const ora = require("ora");
const download = require("download-git-repo");

const questions = [
  {
    type: "input", // type为答题的类型
    name: "projectName", // 本题的key，待会获取answers时通过这个key获取value
    message: "projectName：", // 提示语
    validate(val) {
      if (!val) {
        // 验证一下输入是否正确
        return "please input your folder name!";
      }
      if (fs.existsSync(val)) {
        // 判断文件是否存在
        return "The folder already exists";
      } else {
        return true;
      }
    },
  },
  {
    type: "input",
    name: "version",
    message: "verson(1.0.0)：",
    default: "1.0.0",
    validate(val) {
      return true;
    },
  },
  {
    type: "input",
    name: "repository",
    message: "please input origin repositorie：",
    default: "01super/react-cli",
  },
];

inquirer.prompt(questions).then((answers) => {
  // 获取答案
  const version = answers.version;
  const projectName = answers.projectName;
  const repository = answers.repository;

  const spinner = ora("downloading...");
  spinner.color = "green";
  spinner.start();

  const editFile = function () {
    // 读取文件
    fs.readFile(`${process.cwd()}/${projectName}/package.json`, (err, data) => {
      if (err) throw err;
      // 获取json数据并修改项目名称和版本号
      let _data = JSON.parse(data.toString());
      _data.name = projectName;
      _data.version = version;
      let str = JSON.stringify(_data, null, 4);
      // 写入文件
      fs.writeFile(
        `${process.cwd()}/${projectName}/package.json`,
        str,
        function (err) {
          if (err) throw err;
        }
      );
      spinner.succeed("download successed!");
      spinner.clear();
    });
  };

  download(repository, projectName, {}, (err) => {
    if (err) {
      console.log("load failed: ", err);
    } else {
      editFile();
    }
  });
});



