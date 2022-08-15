# Anguar Start

## Premise
- Node.js をインストール済みであること
- プロジェクトがすでに存在する場合、以下の操作は不要  
  `npm ci` で関連ライブラリをインストールできる

## Install
```
npm i @angular/cli -g

# Windows で ng スクリプト実行が無効化されている場合
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## New Project
```
ng new map --skip-tests

# QA
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use? SCSS   [ https://sass-lang.com/documentation/syntax#scss   
```
```
cd map
```

---

## CSS Normalize

### Install
```
npm i modern-normalize --save
```

### Mod Files

#### styles.scss
```
@import '../node_modules/modern-normalize/modern-normalize.css';
```

---

## Routing

### Mod Files

#### app.component.html
```
<router-outlet></router-outlet>
```

### Make Pages
```
mkdir ./src/app/pages
cd ./src/app/pages
ng g component page-main
cd ../../../
```

#### page-main.component.ts  
```
// 設定例
const routes: Routes = [
  { path: 'cesium', component: PageCesiumComponent },
  { path: 'leaflet', component: PageLeafletComponent },
  { path: '', component: PageMainComponent },
  { path: '**', redirectTo: '' },
];
```
