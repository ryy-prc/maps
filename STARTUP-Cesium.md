# Cesium Start

## Cesium

### Install
```
npm i cesium --save
```

### Make Files

#### cesium.d.ts
```
declare var Cesium: any;
```
#### window.d.ts
```
interface Window {
  CESIUM_BASE_URL: string;
}
```

### Mod Files

#### main.ts
```
window.CESIUM_BASE_URL = '/assets/cesium/';
```

#### angular.json  
"projects" > プロジェクト名 > "architect" > "build" > "options" に以下を追加
- "assets"
    ```
    {
      "glob": "**/*",
      "input": "./node_modules/cesium/Build/Cesium",
      "output": "./assets/cesium"
    }
    ```

- "styles"
    ```
    "./node_modules/cesium/Build/Cesium/Widgets/widgets.css"
    ```

- "scripts"
    ```
    "./node_modules/cesium/Build/Cesium/Cesium.js"
    ```

### Make Directives
```
mkdir ./src/app/directives
cd ./src/app/directives
ng g directive cesium
cd ../../../
```

#### cesium.directive.ts  
地理院地図使用例
```
import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appCesium]'
})
export class CesiumDirective implements OnInit {

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    const viewer = new Cesium.Viewer(this.el.nativeElement);
    const layers = viewer.imageryLayers;

    // add map image
    const cyberjapanImageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: '//cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
      credit: new Cesium.Credit('<a href=https://maps.gsi.go.jp/development/ichiran.html>地理院タイル</a>'),
      maximumLevel: 18,
    });
    layers.addImageryProvider(cyberjapanImageryProvider);
  }

  // 外部からのメソッド呼び出し
  public callTest(call: string) {
    console.log('directive call method: %o', call);
  }

}
```

### Make Components
```
mkdir ./src/app/pages
cd ./src/app/pages
ng g component page-cesium
cd ../../../
```

#### page-cesium.component.ts  
```
import { Component, OnInit, ViewChild } from '@angular/core';
import { CesiumDirective } from 'src/app/directives/cesium.directive';

@Component({
  selector: 'app-page-cesium',
  templateUrl: './page-cesium.component.html',
  styleUrls: ['./page-cesium.component.scss']
})
export class PageCesiumComponent implements OnInit {

  @ViewChild(CesiumDirective)
  private directive: CesiumDirective | undefined;

  constructor() { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(){
    // Directive 内のメソッド呼び出し
    this.directive?.callTest('cesium call');
  }

}
```
