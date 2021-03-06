/*
 * Copyright 2012 the original author or authors.
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class StatusComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotstatus',
            templateUrl: '/static/status_component.html'
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.copter = copter;
        this.flight_mode = copter.getStatus()
            .map(status => status.flight_mode);
        this.armed = copter.getStatus()
            .map(status => status.armed);
    }

    disarm()
    {
        this.copter.setArmed(false);
    }

    arm()
    {
        this.copter.setArmed(true);
    }
}

class AccelerometerComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotaccelerometer',
            template: '<div>Accel: x: {{x | async}}, y: {{y | async}}, z: {{z | async}}</div>'
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.x = copter.getAccelerometer()
            .map(accel => accel.x);
        this.y = copter.getAccelerometer()
            .map(accel => accel.y);
        this.z = copter.getAccelerometer()
            .map(accel => accel.z);
    }
}

class GyroscopeComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotgyroscope',
            template: '<div>Gyro: x: {{x | async}}, y: {{y | async}}, z: {{z | async}}</div>'
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.x = copter.getGyroscope()
            .map(gyro => gyro.x);
        this.y = copter.getGyroscope()
            .map(gyro => gyro.y);
        this.z = copter.getGyroscope()
            .map(gyro => gyro.z);
    }
}

class MagnetometerComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotmagnetometer',
            template: '<div>Mag: x: {{x | async}}, y: {{y | async}}, z: {{z | async}}</div>'
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.x = copter.getMagnetometer()
            .map(mag => mag.x);
        this.y = copter.getMagnetometer()
            .map(mag => mag.y);
        this.z = copter.getMagnetometer()
            .map(mag => mag.z);
    }
}

class RollGuageComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotrollguage',
            template: '<object id="attitude_svg" data="/static/attitude.svg" type="image/svg+xml"></object>'
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.copter = copter;
    }

    ngOnInit()
    {
        var attitude_svg = document.getElementById("attitude_svg");
        var roll_gauge = null;
        var roll_gauge_translate = null;
        var roll_needle = null;
        attitude_svg.addEventListener('load', function() {
            roll_needle = attitude_svg.getSVGDocument().getElementById("layer2");
            roll_gauge = attitude_svg.getSVGDocument().getElementById("layer5");
            roll_gauge_translate = roll_gauge.getAttribute("transform");
        });
        this.subscription = this.copter.getAttitude()
            .subscribe(attitude => {
                if (roll_gauge != null) {
                    var x = roll_needle.getBBox().width / 2.0;
                    var y = roll_needle.getBBox().height / 2.0;
                    var roll = -attitude.roll * 180 / Math.PI;
                    var pitch = attitude.pitch * roll_gauge.getBBox().height / Math.PI;
                    roll_needle.setAttribute("transform",
                        "rotate(" + roll + " " + x + " " + y + ")");
                    roll_gauge.setAttribute("transform",
                        "rotate(" + roll + " " + x + " " + y + ") " +
                        roll_gauge_translate + " translate(0 " + pitch + ")");
                }
            });
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
    }
}

class CompassComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotcompass',
            template: '<object id="compass" data="/static/compass.svg" type="image/svg+xml"></object>'
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.copter = copter;
    }

    ngOnInit()
    {
        var compass = document.getElementById("compass");
        var needle = null;
        var needle_translate = null;
        compass.addEventListener('load', function() {
            needle = compass.getSVGDocument().getElementById("needle");
            needle_translate = needle.getAttribute("transform");
        });
        this.subscription = this.copter.getAttitude()
            .subscribe(attitude => {
                if (needle != null) {
                    var x = needle.getBBox().width / 2.0;
                    var y = needle.getBBox().height / 2.0;
                    var yaw = attitude.yaw * 180 / Math.PI;
                    needle.setAttribute("transform",
                        "rotate(" + -yaw + " " + x + " " + y + ") "
                        + needle_translate);
                }
            });
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
    }
}

class AttitudeComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotattitude',
            template: `<div>
                Roll: {{roll | async | number:'1.4-4'}}, 
                Pitch: {{pitch | async | number:'1.4-4'}}, 
                Yaw: {{yaw | async | number:'1.4-4'}}
            </div>`
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.roll = copter.getAttitude()
            .map(attitude => attitude.roll);
        this.pitch = copter.getAttitude()
            .map(attitude => attitude.pitch);
        this.yaw = copter.getAttitude()
            .map(attitude => attitude.yaw);
    }
}

class RCStateComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rcstate',
            template: '<div>RC Channels: {{channels | async}}</div>'
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.channels = copter.getRCChannels();
    }
}

class WaypointComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotwaypoint',
            template: `<div>
                Lat: {{latitude | async | number:'1.1-5'}}, 
                Lng: {{longitude | async | number:'1.1-5'}}, 
                Alt: {{altitude | async | number:'1.1-1'}}m
                </div>`
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.latitude = copter.getWaypoint()
            .map(waypoint => waypoint.latitude);
        this.longitude = copter.getWaypoint()
            .map(waypoint => waypoint.longitude);
        this.altitude = copter.getWaypoint()
            .map(waypoint => waypoint.altitude);
    }
}

class GlobalPositionComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'globalposition',
            template: '<div>Lat: {{latitude | async}}, Lng: {{longitude | async}}</div>'
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.latitude = copter.getGlobalPosition()
            .map(position => position.latitude);
        this.longitude = copter.getGlobalPosition()
            .map(position => position.longitude);
    }
}

class MapComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotmap',
            template: '<div id="map" style="height:400px;width:500px;"></div>'
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.copter = copter;
    }

    ngOnInit()
    {
        var map = L.map('map', {
            crs: L.CRS.EPSG3857,
            center: {lat: 37.77, lng: -122.49},
            zoom: 10,
            contextmenu: true,
            contextmenuWidth: 150,
            contextmenuItems: [
                {
                    text: 'Set Waypoint',
                    callback: e => {
                        this.copter.setWaypoint(e.latlng.lat, e.latlng.lng);
                    },
                }
            ],
        });
        var server_name = window.location.hostname;
        var mapnik_url = 'http://' + server_name + ':8086/ex/{z}/{x}/{y}.png';

        L.tileLayer(mapnik_url, {
            maxZoom: 18,
        }).addTo(map);

        var copterIcon = L.AwesomeMarkers.icon({
            prefix: 'fa',
            icon: 'plane',
            markerColor: 'red'
        });

        this.marker = L.marker([37.77, -122.49], {
            title: 'Multicopter',
            icon: copterIcon
        }).addTo(map);

        var waypointIcon = L.AwesomeMarkers.icon({
            prefix: 'fa',
            icon: 'flag',
            markerColor: 'green'
        });

        this.waypoint_marker = L.marker([37.77, -122.49], {
            title: 'Waypoint',
            icon: waypointIcon
        }).addTo(map);

        this.waypoint_subscription = this.copter.getWaypoint().subscribe((waypoint) => {
            var lat = waypoint.latitude;
            var lng = waypoint.longitude;
            this.waypoint_marker.setLatLng([lat, lng]);
        });

        this.gps_subscription = this.copter.getGlobalPosition().subscribe((position) => {
            this.marker.setLatLng([position.latitude, position.longitude]);
        });
    }

    ngOnDestroy()
    {
        this.waypoint_subscription.unsubscribe();
        this.gps_subscription.unsubscribe();
    }
}

class ComeHereComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotcomehere',
            template: '<button type="button" class="btn" (click)="clicked()">Come To Me</button>'
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.copter = copter;
    }

    clicked()
    {
        navigator.geolocation.getCurrentPosition((loc) => {
            this.copter.setWaypoint(loc.coords.latitude, loc.coords.longitude);
        });
    }
}

class AccelerometerGraphComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'accelerometergraph',
            template: '<div id="accel_z_chart" style="min-width: 400px; height: 400px; margin: 0 auto;"></div>'
        })];
    }

    static get parameters()
    {
        return [Copter];
    }

    constructor(copter)
    {
        this.copter = copter;
    }

    ngOnInit()
    {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        var chart;
        $('#accel_z_chart').highcharts({
            chart: {
                type: 'spline',
                animation: false,
                marginRight: 10,
            },
            title: {
                text: 'Accelerometer'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150,
                minRange: 15000
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'data',
                data: [],
            }]
        });

        var last_redraw = new Date().getTime();
        this.subscription = this.copter.getAccelerometer().subscribe(accel => {
            if ($('#accel_z_chart').length > 0) {
                var series = $('#accel_z_chart').highcharts().series[0];
                var x = (new Date()).getTime();
                var redraw = x - last_redraw > 500;
                var extremes = series.xAxis.getExtremes();
                // Shift out the data if there's more than 15secs on-screen
                var shift = extremes.dataMax - extremes.dataMin > 15000;
                if (redraw) {
                    last_redraw = x;
                }
                series.addPoint([x, accel.z], redraw, shift);
            }
        });
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
    }
}

class RecordingButton
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotrecordingbutton',
            templateUrl: '/static/recording_button.html'
        })];
    }

    static get parameters()
    {
        return [Camera];
    }

    constructor(camera)
    {
        this.camera = camera;
    }

    clicked()
    {
        if (this.camera.getRecording()) {
            this.camera.stopRecording();
        }
        else {
            this.camera.startRecording();
        }
    }
}

class TakePictureButton
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'takepicturebutton',
            templateUrl: '/static/take_picture_button.html'
        })];
    }

    static get parameters()
    {
        return [Camera];
    }

    constructor(camera)
    {
        this.camera = camera;
    }
}

class MediaListComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotmedialist',
            templateUrl: '/static/media_list.html'
        })];
    }

    static get parameters()
    {
        return [OnboardComputer];
    }

    constructor(computer)
    {
        this.media = computer.getMedia();
    }
}

class ShutdownComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'shutdownbutton',
            template: `<button type="button" class="btn btn-danger" 
                (click)="clicked()">Shutdown On-board Computer</button>`
        })];
    }

    static get parameters()
    {
        return [OnboardComputer];
    }

    constructor(computer)
    {
        this.computer = computer;
    }

    clicked()
    {
        this.computer.shutdown();
    }
}

class VideoDevicesComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'videodevices',
            templateUrl: '/static/video_devices_component.html'
        })];
    }

    static get parameters()
    {
        return [OnboardComputer];
    }

    constructor(computer)
    {
        this.computer = computer;
        this.devices = computer.getVideoDevices();
        this.selected_device = computer.getActiveVideoDevice();
    }

    onSelected(device)
    {
        this.computer.setActiveVideoDevice(device);
    }
}

class CameraResolutionsComponent
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'cameraresolutions',
            templateUrl: '/static/camera_resolutions_component.html'
        })];
    }

    static get parameters()
    {
        return [Camera];
    }

    constructor(camera)
    {
        this.camera = camera;
        this.resolutions = camera.getAllResolutions();
        this.selected_resolution = camera.getResolution();
    }

    onSelected(resolution)
    {
        this.camera.setResolution(resolution);
    }
}

class ComputerVisionToggle
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'computervisiontoggle',
            template: `Computer vision: <input type="checkbox" [ngModel]="enabled | async" 
                (ngModelChange)="setEnabled($event)">`
        })];
    }

    static get parameters()
    {
        return [OnboardComputer];
    }

    constructor(computer)
    {
        this.computer = computer;
        this.enabled = computer.isComputerVisionEnabled();
    }

    setEnabled(enable)
    {
        this.computer.setComputerVision(enable);
    }
}

class FPSDisplay
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'fpsdisplay',
            template: 'FPS: {{fps | async}}'
        })];
    }

    static get parameters()
    {
        return [VideoStream];
    }

    constructor(stream)
    {
        this.fps = stream.getFPS();
    }
}

class VideoDisplay
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'videodisplay',
            template: '<div id="video" style="cursor: pointer;" (click)="camera.takePicture()"></div>'
        })];
    }

    static get parameters()
    {
        return [VideoStream, Camera, OnboardComputer];
    }

    constructor(stream, camera, computer)
    {
        this.camera = camera;
        this.stream = stream;
        this.computer = computer;
    }

    ngOnInit()
    {
        var renderer = PIXI.autoDetectRenderer(640, 480, {transparent: true});
        this.resolution_subscription = this.stream.getResolution().subscribe(resolution => {
            renderer.resize(resolution.width, resolution.height);
            document.getElementById('video').style.width = resolution.width + "px";
            document.getElementById('video').style.height = resolution.height + "px";
        });

        document.getElementById('video').appendChild(renderer.view);
        renderer.view.style.zIndex = "2";

        // create the root of the scene graph
        var stage = new PIXI.Container();
        var textObjs = new Map();
        this.vision_subscription = this.computer.getVisionTargets().subscribe(function(message) {
            var targetIds = new Set();
            for (let target of message.targets) {
                targetIds.add(target.id);
                if (!textObjs.has(target.id)) {
                    textObjs.set(target.id, new PIXI.Text(target.description, {fill: 'red'}));
                    stage.addChild(textObjs.get(target.id));
                }
                var textObj = textObjs.get(target.id);
                textObj.visible = true;
                textObj.x = renderer.width * (target.x + 1) / 2.0;
                textObj.y = renderer.height * (1 - target.y) / 2.0;
            }
            for (let [key, value] of textObjs) {
                if (!targetIds.has(key)) {
                    // Hide element rather than removing it. Because adding/removing is more expensive
                    value.visible = false;
                }
            }
            renderer.render(stage);
        });

        this.canvas_subscription = this.stream.getCanvas().subscribe(canvas =>{
            document.getElementById('video').appendChild(canvas);
            canvas.style.zIndex = "1";
        });
    }

    ngOnDestroy()
    {
        this.resolution_subscription.unsubscribe();
        this.vision_subscription.unsubscribe();
        this.canvas_subscription.unsubscribe();
    }
}

class RospilotApp
{
    static get annotations()
    {
        return [new ng.core.Component({
            selector: 'rospilotapp',
            templateUrl: '/static/app.html',
            directives: [ng.router.ROUTER_DIRECTIVES]
        })];
    }

    static get parameters()
    {
        return [];
    }
}

class FlightControlPage
{
    static get annotations()
    {
        return [new ng.core.Component({
            templateUrl: '/static/flight_control.html',
            directives: [StatusComponent, ComeHereComponent, RollGuageComponent, CompassComponent,
                MapComponent, WaypointComponent, AttitudeComponent, GlobalPositionComponent, RCStateComponent,
                GyroscopeComponent, AccelerometerComponent, MagnetometerComponent]
        })];
    }

    static get parameters()
    {
        return [];
    }
}

class GraphsPage
{
    static get annotations()
    {
        return [new ng.core.Component({
            templateUrl: '/static/graphs.html',
            directives: [AccelerometerGraphComponent]
        })];
    }

    static get parameters()
    {
        return [];
    }
}

class CameraPage
{
    static get annotations()
    {
        return [new ng.core.Component({
            templateUrl: '/static/camera.html',
            directives: [VideoDisplay, RecordingButton, TakePictureButton, FPSDisplay, MediaListComponent]
        })];
    }

    static get parameters()
    {
        return [];
    }
}

class SettingsPage
{
    static get annotations()
    {
        return [new ng.core.Component({
            templateUrl: '/static/settings.html',
            directives: [VideoDevicesComponent, CameraResolutionsComponent, ComputerVisionToggle, ShutdownComponent]
        })];
    }

    static get parameters()
    {
        return [];
    }
}
