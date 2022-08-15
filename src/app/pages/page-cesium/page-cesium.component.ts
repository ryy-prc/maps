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
