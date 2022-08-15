import { Directive, ElementRef } from '@angular/core';
import { AbstractMapCesium } from './abstracts/abstract-map-cesium';
import { Position, Route } from './interfaces/interface-map';
import { RouteGraphics } from './route-graphics';

@Directive({
  selector: '[appCesium]'
})
export class CesiumDirective extends AbstractMapCesium {

  private routeGraphics: RouteGraphics = new RouteGraphics();

  constructor(private el: ElementRef) {
    super()
  }

  ngOnInit(): void {
    this.cesiumInit(this.el.nativeElement);

    // add map image
    // this.layers.addImageryProvider(this.createImageryProvider());

    // camera position
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(138, 36, 2500000),
      orientation: {
        heading: 0, // 水平方向の回転度（ラジアン）
        pitch: -1.5, // 垂直方向の回転度（ラジアン）
        roll: 0
      }
    });

    // map event
    this.screenHandler.setInputAction((e: any) => {
      const pick = this.viewer.scene.pick(e.position);
      if (Cesium.defined(pick)) {
        console.log("pick: ", pick);
        
        // const cameraPosition = this.viewer.scene.camera.positionWC;
        // const cartesian = this.viewer.selectedEntity.position.getValue(Cesium.JulianDate.now());
        // cartesian.z = cameraPosition.z;
        // // move
        // this.viewer.camera.flyTo({
        //   // destination: this.viewer.selectedEntity.position.getValue(Cesium.JulianDate.now()),
        //   destination: cartesian,
        // });
      }
      else {
        this.clickMap(e);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * 
   * @param e click event
   */
  private clickMap = (e: any) => {
    const ellipsoid = this.viewer.scene.globe.ellipsoid;
    const mousePosition = new Cesium.Cartesian2(e.position.x, e.position.y);
    const cartesian = this.viewer.camera.pickEllipsoid(mousePosition, ellipsoid);

    if (Cesium.defined(cartesian)) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      // const altitude = cartographic.height;

      // const cameraPosition = viewer.scene.camera.positionWC;
      // const ellipsoidPosition = viewer.scene.globe.ellipsoid.scaleToGeodeticSurface(cameraPosition);
      // const cameraHeight = Cesium.Cartesian3.magnitude(Cesium.Cartesian3.subtract(cameraPosition, ellipsoidPosition, new Cesium.Cartesian3()));

      const positions = [
        Cesium.Cartographic.fromDegrees(longitude, latitude),
      ];

      this.convertTerrainPosition(positions)
      .then((positions: Position[]) => {
        positions.forEach(position => {
          this.routeGraphics.drawPath(this.viewer, position);
        });
      })
      .catch((e: any) => console.error(e));
    }
  }

  public callTest(call: string) {
    console.log('directive call method: %o', call);
  }

}