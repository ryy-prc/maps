import { ElementRef, OnInit } from '@angular/core';
import { Position, Route } from '../interfaces/interface-map';

export abstract class AbstractMapCesium {

  protected viewer: any;
  protected widget: any;
  protected layers: any;
  protected camera: any;
  protected screenHandler: any;
  protected terrainProvider: any;

  constructor() {
  }

  protected cesiumInit(nativeElement: any) {
    const options = {
      infoBox: false,
      timeline: false,
      animation: false,
      // selectionIndicator: false,
    }
    this.viewer = new Cesium.Viewer(nativeElement, options);
    this.widget = this.viewer.cesiumWidget;
    this.layers = this.viewer.imageryLayers;
    this.camera = this.viewer.camera;
    this.screenHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.terrainProvider = Cesium.createWorldTerrain();
  }

  protected createImageryProvider(): any {
    return new Cesium.UrlTemplateImageryProvider({
      url: '//cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
      credit: new Cesium.Credit('<a href=https://maps.gsi.go.jp/development/ichiran.html>地理院タイル</a>'),
      maximumLevel: 18,
    });
  }

  protected async convertTerrainPosition(positions: any[]) {
    return new Promise((resolve: (value: Position[]) => void, reject) => {
      Cesium.sampleTerrainMostDetailed(this.terrainProvider,  positions)
      .then((updated: any) => {
        const ret: Position[] = updated.map((cartographic: any) => {
          const longitude = Cesium.Math.toDegrees(cartographic.longitude);
          const latitude = Cesium.Math.toDegrees(cartographic.latitude);
          const altitude = cartographic.height;
          return { longitude, latitude, altitude };
        });
        resolve(ret);
      })
      .catch((e: any) => reject(e));
    })
  }

  protected getPointDescription(positions: Position[]): String {
    return `
      <table>
        <thead>
          <tr>
            <th>Longitude</th>
            <th>Latitude</th>
            <th>Altitude</th>
          </tr>
        </thead>
        <tbody>
          ${
            positions.map(position => `
              <tr>
                <td>${position.longitude}</td>
                <td>${position.latitude}</td>
                <td>${position.altitude}</td>
              </tr>`
            ).reduce((prev, current) => prev + current)
          }
        </tbody>
      </table>`;
  }

}