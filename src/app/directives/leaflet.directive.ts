import { Directive, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { PageLeafletComponent } from '../pages/page-leaflet/page-leaflet.component';
@Directive({
  selector: '[appLeaflet]'
})
export class LeafletDirective {

  /**
   * Leaflet Map
   */
  private map: any;

  /**
   * Group Layer
   */
  private drawnLayer: L.FeatureGroup = new L.FeatureGroup();

  /**
   * Init center position
   */
  // private initPosition: L.LatLngExpression | undefined = [37.4399741, 139.7680664];
  private initPosition: L.LatLngExpression | undefined = [36.06764264881286, 138.0872440338135];

  /**
   * Init zoom level
   */
  private initZoomLevel: number = 16;

  /**
   * Open Street Map URL
   */
  private openstreetMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  /**
   * Copyright
   */
  private openstreetAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';


  constructor(
    private el: ElementRef,
    private parent: PageLeafletComponent,
  ) { }

  ngOnInit(): void {
    // new map
    this.map = this.createMap(this.el.nativeElement);

    // var drawnItems = new L.FeatureGroup().addTo(this.map);
    // var drawControl = new L.Control.Draw({
    //   draw: {
    //     circle: {
    //       feet: false
    //     },
    //   },
    //   edit: {
    //     featureGroup: drawnItems,
    //   },
    // }).addTo(this.map);

    // set event
    this.map.on('click', (e: any) => {
      this.onMapClick(e);
    })
  }
  /**
   * マップ作成
   *
   * @returns Leaflet.Map
   */
  public createMap(mapId: any): L.Map {

    const map = L.map(mapId, {
      preferCanvas: true,
      center: this.initPosition,
      zoom: this.initZoomLevel,
      zoomControl: false,
      doubleClickZoom: false,
    });

    L.control.scale({
      maxWidth: 200,
      position: 'bottomright',
      imperial: false,
    }).addTo(map);

    L.control.zoom({
      position: 'bottomleft',
    }).addTo(map);

    // Map Fixed
    const osm = L.tileLayer(this.openstreetMapUrl, {
      attribution: this.openstreetAttribution
    });

    const baseLayers = {
      "OpenStreetMap": osm,
    }

    const overlays = {
      'drawnLayer': this.drawnLayer,
    }

    // // add Layer
    // L.control.layers(baseLayers, overlays, {
    //   collapsed: false
    // }).addTo(map);

    // init display
    map.addLayer(osm);
    map.addLayer(this.drawnLayer);

    return map;
  }

  /**
   * イベント：CLEAR
   */
  public drawnClear(): void {
    this.drawnLayer.clearLayers();
  }

  /**
   * イベント：マップクリック
   * @param e
   */
  private onMapClick = (e: any): void => {
    console.log('Clicked Map: ', e.latlng.lng, e.latlng.lat);
    // this.createMarker(e.latlng, this.map);
    this.parent.setPickLocation(e.latlng);
  }

  /**
   * イベント：マーカークリック
   * @param e
   */
  private onMarkerClick = (e: any): void => {
    console.log('Clicked Marker: ', e.latlng.lng, e.latlng.lat);
    this.parent.setPickLocation(e.latlng);
  }

  /**
   * 
   * @param latlng 
   * @param popup 
   * @returns 
   */
  public createMarker(latlng: L.LatLngExpression, popup: ((layer: L.Layer) => L.Content) | L.Content | L.Popup | undefined = undefined): L.Marker {
    const marker = L.marker(latlng)
      .on('click', this.onMarkerClick)
      // .addTo(this.map);
    if (popup) {
      marker.bindPopup(popup).openPopup();
    }
    this.drawnLayer.addLayer(marker);
      
    return marker;
  }

  public createPolyline(latlngs: L.LatLngExpression[]): L.Polyline {
    const polyline = L.polyline(latlngs)
      // .on('click', (e: any) => console.log("Polyline: ", e))
      // .addTo(this.map);
    this.drawnLayer.addLayer(polyline);
    return polyline;
  }

}
