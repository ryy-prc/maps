import { Component, OnInit, ViewChild } from '@angular/core';
import { LeafletDirective } from 'src/app/directives/leaflet.directive';

import turf_along from '@turf/along'
import turf_distance from '@turf/distance'
import turf_length from '@turf/length'
import * as turf_helpers from '@turf/helpers'

const turf = {
  along: turf_along,
  distance: turf_distance,
  length: turf_length,
  ...turf_helpers,
};

type AlongPoint = {
  kmLabel: number,
  actualValue: number,
  position: Position | null,
}

type Position = {
  longitude: number | null,
  latitude: number | null,
}

type PositionInformation = {
  distance: number | null,
  alongPoints: AlongPoint[],
}

@Component({
  selector: 'app-page-leaflet',
  templateUrl: './page-leaflet.component.html',
  styleUrls: ['./page-leaflet.component.scss']
})
export class PageLeafletComponent implements OnInit {

  /**
   * Leaflet.
   */
  @ViewChild(LeafletDirective)
  private directive: LeafletDirective | undefined;

  /**
   * Form input positions.
   */
  positions: Position[] = [];

  /**
   * Position Information.
   */
  positionsInformation: PositionInformation = {
    distance: null,
    alongPoints: [
      { kmLabel: 0.1, actualValue: 0.0997, position: null },
      { kmLabel: 0.25, actualValue: 0.2497, position: null },
      { kmLabel: 0.35, actualValue: 0.3497, position: null },
      { kmLabel: 0.5, actualValue: 0.5, position: null },
      { kmLabel: 1, actualValue: 1, position: null },
    ]
  };

  /**
   * Select position.
   */
  pickLocation: Position = {
    longitude: 0,
    latitude: 0,
  };

  constructor() { }

  ngOnInit(): void {
    // load form position
    const _positions = this.loadFormPositions();
    if (_positions) {
      this.positions = _positions;
    }
    else {
      this.addEmptyPosition();
    }
  }

  ////////////////////////////////////////////////////////////////////// public

  public trackByItem(index: number, obj: any): number {
    return index;
  }

  public setPickLocation(latlng: L.LatLng): void {
    this.pickLocation.longitude = latlng.lng;
    this.pickLocation.latitude = latlng.lat;
  }

  public onClearMap(): void {
    this.directive?.drawnClear();
  }

  public onClearForm(): void {
    this.positions = [];
    this.addEmptyPosition();
  }

  public onPlusForm(): void {
    this.addEmptyPosition();
  }

  public onPushMap(): void {
    this.saveFormPositions(this.positions);
    this.drawRoutes(this.positions, this.positionsInformation);
  }

  ////////////////////////////////////////////////////////////////////// private

  private saveFormPositions(form: Position[]) {
    this.saveStorage("form_positions", form);
  }

  private loadFormPositions(): Position[] | null {
    return this.loadStorage("form_positions");
  }

  private saveStorage(key: string, object: any) {
    localStorage.setItem(key, JSON.stringify(object));
  }

  private loadStorage(key: string): any | null {
    const _value = localStorage.getItem(key);
    if (_value) {
      return JSON.parse(_value);
    }
    return null;
  }

  private addEmptyPosition() {
    this.positions.push({ longitude: null, latitude: null });
    console.log("positions add: ", this.positions.length - 1);
  }

  private drawRoutes(positions: Position[], info: PositionInformation | null = null): PositionInformation | null {
    console.log('Input Positions: ', positions);

    const _points = [];
    for (let i = 0; i < positions.length; i++) {
      const _position = positions[i];
      if (_position.longitude == null || _position.latitude == null) {
        continue;
      }
      this.directive?.createMarker(
        [_position.latitude, _position.longitude], 'No.' + i,
      );
      _points.push([_position.longitude, _position.latitude]);
    }

    const line = turf.lineString(_points);
    const distance = turf.length(line, { units: 'kilometers' });

    if (_points.length > 1) {
      this.directive?.createPolyline(_points.map(point => [point[1], point[0]]));
    }

    if (info) {
      info.distance = distance;
      
      const _alongPoints = [_points[0]];
      for (let alongPoint of info.alongPoints) {
        
        const along = turf.along(line, alongPoint.actualValue, { units: 'kilometers' });
        const longitude = along.geometry.coordinates[0];
        const latitude = along.geometry.coordinates[1];
        _alongPoints.push(along.geometry.coordinates);

        const alongDistance = turf.length(turf.lineString(_alongPoints), { units: 'kilometers' });
        
        this.directive?.createMarker(
          [latitude, longitude], 
          `${alongPoint.kmLabel * 1000} m<br/>
          distance: ${alongDistance} km`,
        );
        
        alongPoint.position = { longitude, latitude };
      }

      return info;
    }
    return null;

    // if (this.position.start.longitude && this.position.start.latitude
    //   && this.position.end.longitude && this.position.end.latitude
    // ) {

    //   this.directive?.createPolyline([
    //     [this.position.start.latitude, this.position.start.longitude],
    //     [this.position.end.latitude, this.position.end.longitude],
    //   ]);

    //   // turf
    //   const from = turf.point([this.position.start.longitude, this.position.start.latitude]);
    //   const to = turf.point([this.position.end.longitude, this.position.end.latitude]);
    //   const distance = turf.distance(from, to, { units: 'kilometers' });
    //   console.log("start-end distance: %o km", distance);

    //   if (distance > 0.1) {
    //     const line = turf.lineString([[this.position.start.longitude, this.position.start.latitude], [this.position.end.longitude, this.position.end.latitude]]);
    //     const along = turf.along(line, 0.0997, { units: 'kilometers' });
    //     const longitude = along.geometry.coordinates[0];
    //     const latitude = along.geometry.coordinates[1];
    //     this.directive?.createMarker(
    //       [latitude, longitude], '99.7m',
    //     );
    //     const distance = turf.distance(from, along, { units: 'kilometers' });
    //     console.log('99.7m Position: %o %o, distance: %o km', longitude, latitude, distance);
    //   }

    //   if (distance > 0.25) {
    //     const line = turf.lineString([[this.position.start.longitude, this.position.start.latitude], [this.position.end.longitude, this.position.end.latitude]]);
    //     const along = turf.along(line, 0.2497, { units: 'kilometers' });
    //     const longitude = along.geometry.coordinates[0];
    //     const latitude = along.geometry.coordinates[1];
    //     this.directive?.createMarker(
    //       [latitude, longitude], '249.7m',
    //     );
    //     const distance = turf.distance(from, along, { units: 'kilometers' });
    //     console.log('249.7m Position: %o %o, distance: %o km', longitude, latitude, distance);
    //   }

    //   if (distance > 0.35) {
    //     const line = turf.lineString([[this.position.start.longitude, this.position.start.latitude], [this.position.end.longitude, this.position.end.latitude]]);
    //     const along = turf.along(line, 0.3497, { units: 'kilometers' });
    //     const longitude = along.geometry.coordinates[0];
    //     const latitude = along.geometry.coordinates[1];
    //     this.directive?.createMarker(
    //       [latitude, longitude], '349.7m',
    //     );
    //     const distance = turf.distance(from, along, { units: 'kilometers' });
    //     console.log('349.7m Position: %o %o, distance: %o km', longitude, latitude, distance);
    //   }

    //   if (distance > 0.5) {
    //     const line = turf.lineString([[this.position.start.longitude, this.position.start.latitude], [this.position.end.longitude, this.position.end.latitude]]);
    //     const along = turf.along(line, 0.5, { units: 'kilometers' });
    //     const longitude = along.geometry.coordinates[0];
    //     const latitude = along.geometry.coordinates[1];
    //     this.directive?.createMarker(
    //       [latitude, longitude], '500m',
    //     );
    //     const distance = turf.distance(from, along, { units: 'kilometers' });
    //     console.log('500m Position: %o %o, distance: %o km', longitude, latitude, distance);
    //   }

    //   if (distance > 0.75) {
    //     const line = turf.lineString([[this.position.start.longitude, this.position.start.latitude], [this.position.end.longitude, this.position.end.latitude]]);
    //     const along = turf.along(line, 0.75, { units: 'kilometers' });
    //     const longitude = along.geometry.coordinates[0];
    //     const latitude = along.geometry.coordinates[1];
    //     this.directive?.createMarker(
    //       [latitude, longitude], '750m',
    //     );
    //     const distance = turf.distance(from, along, { units: 'kilometers' });
    //     console.log('750m Position: %o %o, distance: %o km', longitude, latitude, distance);
    //   }

    //   if (distance > 1) {
    //     const line = turf.lineString([[this.position.start.longitude, this.position.start.latitude], [this.position.end.longitude, this.position.end.latitude]]);
    //     const along = turf.along(line, 1, { units: 'kilometers' });
    //     const longitude = along.geometry.coordinates[0];
    //     const latitude = along.geometry.coordinates[1];
    //     this.directive?.createMarker(
    //       [latitude, longitude], '1000m',
    //     );
    //     const distance = turf.distance(from, along, { units: 'kilometers' });
    //     console.log('1000m Position: ', longitude, latitude);
    //     console.log("distance: %o km", distance);
    //   }

    // }

  }

}
