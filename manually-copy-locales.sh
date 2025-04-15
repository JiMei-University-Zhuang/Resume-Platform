#!/bin/bash

# 手动复制语言文件的脚本
# 用法: 在项目根目录执行 ./manually-copy-locales.sh

echo "开始手动复制语言文件..."

# 确保目标目录存在
if [ ! -d "./dist/locales" ]; then
  mkdir -p ./dist/locales
  echo "创建目录: ./dist/locales"
fi

# 检查源目录是否存在
if [ ! -d "./src/locales" ]; then
  echo "错误: 源目录 ./src/locales 不存在!"
  exit 1
fi

# 复制语言文件
echo "正在复制语言文件..."

# 先尝试使用 Node.js 脚本
if command -v node &> /dev/null; then
  echo "使用 Node.js 脚本处理语言文件..."
  node ./copy-locales.js
  if [ $? -eq 0 ]; then
    echo "✅ 语言文件处理成功!"
    exit 0
  else
    echo "⚠️ Node.js 脚本执行失败，尝试使用备用方法..."
  fi
fi

# 备用方法: 直接复制文件
echo "使用直接复制方法..."
cp -rv ./src/locales/* ./dist/locales/

# 如果有 .ts 文件，提示手动处理
TS_FILES=$(find ./dist/locales -name "*.ts" | wc -l)
if [ $TS_FILES -gt 0 ]; then
  echo "⚠️ 警告: 发现 .ts 文件，这些文件可能无法直接使用。"
  echo "建议手动将这些文件转换为 JSON 格式，或者重新运行构建命令。"
fi

echo "🎉 语言文件复制完成!" 