import { Position, Route } from './interfaces/interface-map';
import turf_along from '@turf/along'
import turf_distance from '@turf/distance'
import * as turf_helpers from '@turf/helpers'

const turf = {
  along: turf_along,
  distance: turf_distance,
  ...turf_helpers,
};

export class RouteGraphics {
  
  private clickModeStandBy: boolean = true;

  private pointSize = 10;

  private routes: Route[] = [];

  constructor() {
  }

  public drawPath(viewer: any, position: Position) {

    if (this.clickModeStandBy) {
      this.clickModeStandBy = false;

      // set route-start
      const id = this.routes.length;
      const route: Route = {
        id,
        start: position,
        end: undefined
      };
      this.routes.push(route);
      
      // draw
      const startPoint = {
        id: 'route-' + id + '-start',
        position: Cesium.Cartesian3.fromDegrees(route.start.longitude, route.start.latitude, route.start.altitude),
        point: {
          color: Cesium.Color.RED,
          pixelSize: this.pointSize
        },
        description: this.getPointDescription([route.start]),
      };
      viewer.entities.add(startPoint);

      console.log("%o: set-start: %o, %o, %o", id, route.start.longitude, route.start.latitude, route.start.altitude);
    }
    else {
      this.clickModeStandBy = true;

      // set route-end
      const id = this.routes.length - 1;
      const route = this.routes[id];
      route.end = position;
      
      // draw
      const line = {
        id: 'route-' + id + '-line',
        polyline: {
          positions: [
            Cesium.Cartesian3.fromDegrees(route.start.longitude, route.start.latitude, route.start.altitude),
            Cesium.Cartesian3.fromDegrees(route.end.longitude, route.end.latitude, route.end.altitude),
          ],
          material: Cesium.Color.GREEN,
          depthFailMaterial: Cesium.Color.BLACK,
        },
        description: this.getPointDescription([route.start, route.end]),
      };

      const endPoint = {
        id: 'route-' + id + '-end',
        position: Cesium.Cartesian3.fromDegrees(route.end.longitude, route.end.latitude, route.end.altitude),
        point: {
          color: Cesium.Color.BLUE,
          pixelSize: this.pointSize
        },
        description: this.getPointDescription([route.end]),
      };

      viewer.entities.add(line);
      viewer.entities.add(endPoint);

      // turf
      const from = turf.point([route.start.longitude, route.start.latitude]);
      const to = turf.point([route.end.longitude, route.end.latitude]);
      const distance = turf.distance(from, to, { units: 'kilometers' });
      console.log("distance: %o kilometers", distance);

      if (distance > 1) {
        const line = turf.lineString([[route.start.longitude, route.start.latitude], [route.end.longitude, route.end.latitude]]);
        const along = turf.along(line, 1, { units: 'kilometers' });
        const altDiff = route.end.altitude - route.start.altitude;
        const altPerc = 1 / distance;
        
        const longitude = along.geometry.coordinates[0];
        const latitude = along.geometry.coordinates[1];
        const altitude = route.start.altitude + altDiff * altPerc;

        const oneKilom = {
          id: 'route-' + id + '-oneKilom',
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
          point: {
            color: Cesium.Color.ORANGE,
            pixelSize: this.pointSize
          },
          description: this.getPointDescription([{longitude, latitude, altitude}]),
        };
        viewer.entities.add(oneKilom);
      }

      console.log("%o: set-end: %o, %o, %o", id, route.end.longitude, route.end.latitude, route.end.altitude);
    }
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