/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global require*/
var Marionette = require('marionette');
var store = require('js/store');
var _ = require('underscore');
var calculateConvexHull = require('geo-convex-hull');

var ClusterView = Marionette.ItemView.extend({
    template: false,
    geometry: undefined,
    convexHull: undefined,
    initialize: function(options) {
        this.geometry = [];
        this.geoController = options.geoController;
        this.handleCluster();
        this.addConvexHull();
        this.updateSelected();
        this.listenTo(this.options.selectionInterface.getSelectedResults(), 'update add remove reset', this.updateSelected);
    },
    handleCluster: function() {
        var center = this.options.map.getCartographicCenterOfClusterInDegrees(this.model);
        this.geometry.push(this.options.map.addPointWithText(center, {
            id: this.model.get('results').map(function(result) {
                return result.id;
            }),
            color: this.model.get('results').first().get('metacard').get('color'),
            view: this
        }));
    },
    addConvexHull: function() {
        var points = this.model.get('results').map(function(result) {
            return result.get('metacard').get('geometry').getAllPoints();
        });
        var data = _.flatten(points, true).map(function(coord) {
            return {
                longitude: coord[0],
                latitude: coord[1]
            };
        });
        var convexHull = calculateConvexHull(data).map(function(coord) {
            return [coord.longitude, coord.latitude];
        });
        convexHull.push(convexHull[0]);
        var geometry = this.options.map.addLine(convexHull, {
            id: this.model.get('results').map(function(result) {
                return result.id;
            }),
            color: this.model.get('results').first().get('metacard').get('color'),
            view: this
        });
        this.options.map.hideGeometry(geometry);
        this.geometry.push(geometry);
    },
    handleHover: function(id) {
        if (id && (this.model.get('results').map(function(result) {
                return result.id;
            }).toString() === id.toString())) {
            this.options.map.showGeometry(this.geometry[1]);
        } else {
            this.options.map.hideGeometry(this.geometry[1]);
        }
    },
    updateSelected: function() {
        var selected = 0;
        this.model.get('results').forEach(function(result) {
            if (this.options.selectionInterface.getSelectedResults().get(result)) {
                selected++;
            }
        }.bind(this));
        if (selected === this.model.get('results').length) {
            this.showFullySelected();
        } else if (selected > 0) {
            this.showPartiallySelected();
        } else {
            this.showUnselected();
        }
    },
    showFullySelected: function() {
        this.options.map.updateCluster(this.geometry, {
            color: this.model.get('results').first().get('metacard').get('color'),
            isSelected: true,
            count: this.model.get('results').length,
            outline: 'black',
            textFill: 'black'
        });
    },
    showPartiallySelected: function() {
        this.options.map.updateCluster(this.geometry, {
            color: this.model.get('results').first().get('metacard').get('color'),
            isSelected: false,
            count: this.model.get('results').length,
            outline: 'black',
            textFill: 'white'
        });
    },
    showUnselected: function() {
        this.options.map.updateCluster(this.geometry, {
            color: this.model.get('results').first().get('metacard').get('color'),
            isSelected: false,
            count: this.model.get('results').length,
            outline: 'white',
            textFill: 'white'
        });
    },
    onDestroy: function() {
        if (this.geometry) {
            this.geometry.forEach(function(geometry) {
                this.options.map.removeGeometry(geometry);
            }.bind(this));
        }
    }
});

module.exports = ClusterView;