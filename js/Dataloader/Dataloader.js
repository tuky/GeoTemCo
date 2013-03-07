/*
* Dataloader.js
*
* Copyright (c) 2013, Sebastian Kruse. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class Dataloader
 * Implementation for a Dataloader UI
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {HTML object} parent div to append the Dataloader
 */
function Dataloader(parent) {

	this.dataLoader = this;
	
	this.parent = parent;
	this.options = parent.options;

	this.initialize();
}

Dataloader.prototype = {

	show : function() {
		this.dataloaderDiv.style.display = "block";
	},

	hide : function() {
		this.dataloaderDiv.style.display = "none";
	},

	initialize : function() {

		this.addKMLLoader();
		this.addKMZLoader();
		
		// trigger change event on the select so 
		// that only the first loader will be shown
		$(this.parent.gui.loaderTypeSelect).change();
	},
	
	addKMLLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='KMLLoader'>KML File URL</option>");
		
		this.KMLLoaderTab = document.createElement("div");
		$(this.KMLLoaderTab).attr("id","KMLLoader");
		
		this.kmlURL = document.createElement("input");
		$(this.kmlURL).attr("type","text");
		$(this.KMLLoaderTab).append(this.kmlURL);
		
		this.loadKMLButton = document.createElement("button");
		$(this.loadKMLButton).text("load KML");
		$(this.KMLLoaderTab).append(this.loadKMLButton);

		$(this.loadKMLButton).click($.proxy(function(){
			var kmlURL = $(this.kmlURL).val();
			if (typeof this.options.proxy != 'undefined')
				kmlURL = this.options.proxy + kmlURL;
			var kml = GeoTemConfig.getKml(kmlURL);
			if (kml != null) {
				var dataSet = new Dataset(GeoTemConfig.loadKml(kml));
				
				if (dataSet != null) {
					$(this.parent.attachedWidgets).each(function(){
						if ($.inArray(dataSet, this.datasets) == -1)
								this.datasets.push(dataSet);
						this.core.display(this.datasets);
					});
				}
			}
		},this));

		$(this.parent.gui.loaders).append(this.KMLLoaderTab);
	},
	
	addKMZLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='KMZLoader'>KMZ File URL</option>");
		
		this.KMZLoaderTab = document.createElement("div");
		$(this.KMZLoaderTab).attr("id","KMZLoader");
		
		this.kmzURL = document.createElement("input");
		$(this.kmzURL).attr("type","text");
		$(this.KMZLoaderTab).append(this.kmzURL);
		
		this.loadKMZButton = document.createElement("button");
		$(this.loadKMZButton).text("load KMZ");
		$(this.KMZLoaderTab).append(this.loadKMZButton);

		$(this.loadKMZButton).click($.proxy(function(){
	    	
	    	var parent = this.parent;
			
			var kmzURL = $(this.kmzURL).val();
			if (typeof this.options.proxy != 'undefined')
				kmzURL = this.options.proxy + kmzURL;
		    var req = new XMLHttpRequest();
		    req.open("GET",kmzURL,true);
		    req.responseType = "arraybuffer";
		    req.onload = function() {
		    	var zip = new JSZip();
		    	zip.load(req.response, {base64:false});
		    	var kmlFiles = zip.file(new RegExp("kml$"));
		    	
		    	$(kmlFiles).each(function(){
					var kml = this;
					if (kml.data != null) {
						var dataSet = new Dataset(GeoTemConfig.loadKml($.parseXML(kml.data)), kml.name);
						
						if (dataSet != null) {
							$(parent.attachedWidgets).each(function(){
								if ($.inArray(dataSet, this.datasets) == -1)
										this.datasets.push(dataSet);
								this.core.display(this.datasets);
							});
						}
					}
		    	});
		    };
		    req.send();

		},this));

		$(this.parent.gui.loaders).append(this.KMZLoaderTab);
	},
	
	addLocalKMLLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='LocalKMLLoader'>local KML File</option>");
		
		this.localKMLLoaderTab = document.createElement("div");
		$(this.localKMLLoaderTab).attr("id","LocalKMLLoader");
		
		this.kmlURL = document.createElement("input");
		$(this.kmlURL).attr("type","file");
		$(this.localKMLLoaderTab).append(this.kmlURL);
		
		this.loadKMLButton = document.createElement("button");
		$(this.loadKMLButton).text("load KML");
		$(this.localKMLLoaderTab).append(this.loadKMLButton);

		$(this.loadKMLButton).click($.proxy(function(){
			var kmlURL = $(this.kmlURL).val();
			var kml = GeoTemConfig.getKml(kmlURL);
			if (kml != null) {
				var dataSet = new Dataset(GeoTemConfig.loadKml(kml));
				
				if (dataSet != null) {
					$(this.parent.attachedWidgets).each(function(){
						if ($.inArray(dataSet, this.datasets) == -1)
								this.datasets.push(dataSet);
						this.core.display(this.datasets);
					});
				}
			}
		},this));

		$(this.parent.gui.loaders).append(this.KMLLoaderTab);
	}
};
