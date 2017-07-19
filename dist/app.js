/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "d3067f04779f2544a19d"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(76)(__webpack_require__.s = 76);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(5))(7);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(5))(110);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.merged = exports.Tool = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _objMerged = __webpack_require__(34);

var _objMerged2 = _interopRequireDefault(_objMerged);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var target = 'https://cnodejs.org';
var Tool = {};

//发送ajax请求和服务器交互
Tool.ajax = function (mySetting) {

    var setting = {
        url: window.location.pathname, //默认ajax请求地址
        async: true, //true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false
        type: 'GET', //请求的方式
        data: {}, //发给服务器的数据
        dataType: 'json',
        success: function success(text) {}, //请求成功执行方法
        error: function error() {} //请求失败执行方法
    };

    var aData = []; //存储数据
    var sData = ''; //拼接数据
    //属性覆盖
    for (var attr in mySetting) {
        setting[attr] = mySetting[attr];
    }
    for (var attr in setting.data) {
        aData.push(attr + '=' + filter(setting.data[attr]));
    }
    sData = aData.join('&');
    setting.type = setting.type.toUpperCase();

    var xhr = new XMLHttpRequest();
    try {
        if (setting.type == 'GET') {
            //get方式请求
            sData = setting.url + '?' + sData;
            xhr.open(setting.type, sData + '&' + new Date().getTime(), setting.async);
            xhr.send();
        } else {
            //post方式请求
            xhr.open(setting.type, setting.url, setting.async);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(sData);
        }
    } catch (e) {
        return httpEnd();
    }

    if (setting.async) {
        xhr.addEventListener('readystatechange', httpEnd, false);
    } else {
        httpEnd();
    }

    function httpEnd() {
        if (xhr.readyState == 4) {
            var head = xhr.getAllResponseHeaders();
            var response = xhr.responseText;
            //将服务器返回的数据，转换成json

            if (/application\/json/.test(head) || setting.dataType === 'json' && /^(\{|\[)([\s\S])*?(\]|\})$/.test(response)) {
                response = JSON.parse(response);
            }

            if (xhr.status == 200) {
                setting.success(response, setting, xhr);
            } else {
                setting.error(setting, xhr);
            }
        }
    }
    xhr.end = function () {
        xhr.removeEventListener('readystatechange', httpEnd, false);
    };

    function filter(str) {
        //特殊字符转义
        str += ''; //隐式转换
        str = str.replace(/%/g, '%25');
        str = str.replace(/\+/g, '%2B');
        str = str.replace(/ /g, '%20');
        str = str.replace(/\//g, '%2F');
        str = str.replace(/\?/g, '%3F');
        str = str.replace(/&/g, '%26');
        str = str.replace(/\=/g, '%3D');
        str = str.replace(/#/g, '%23');
        return str;
    }
    return xhr;
};

//封装ajax post请求

Tool.post = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'POST', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () {}, //请求成功执行方法
        error: error || function () {} //请求失败执行方法
    };
    return Tool.ajax(setting);
};

//封装ajax get请求

Tool.get = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'GET', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () {}, //请求成功执行方法
        error: error || function () {} //请求失败执行方法
    };
    return Tool.ajax(setting);
};

//格式化时间

Tool.formatDate = function (str) {
    var date = new Date(str);
    var time = new Date().getTime() - date.getTime(); //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
    if (time < 0) {
        return '';
    } else if (time / 1000 < 60) {
        return '刚刚';
    } else if (time / 60000 < 60) {
        return parseInt(time / 60000) + '分钟前';
    } else if (time / 3600000 < 24) {
        return parseInt(time / 3600000) + '小时前';
    } else if (time / 86400000 < 31) {
        return parseInt(time / 86400000) + '天前';
    } else if (time / 2592000000 < 12) {
        return parseInt(time / 2592000000) + '月前';
    } else {
        return parseInt(time / 31536000000) + '年前';
    }
};

//本地数据存储或读取

Tool.localItem = function (key, value) {
    if (arguments.length == 1) {
        return localStorage.getItem(key);
    } else {
        return localStorage.setItem(key, value);
    }
};

//删除本地数据

Tool.removeLocalItem = function (key) {
    if (key) {
        return localStorage.removeItem(key);
    }
    return localStorage.removeItem();
};

Tool.setUrlParams = function (origin, params) {
    var result = origin;
    for (var i in params) {
        if (!/\?/.test(result)) {
            result += '?' + i + '=' + params[i];
        } else {
            result += '&' + i + '=' + params[i];
        }
    }
    return result;
};

// 本地数据存储或读取
Tool.getOrSetItem = function (key, value) {
    if (arguments.length == 1) {
        return JSON.parse(localStorage.getItem(key));
    } else {
        return localStorage.setItem(key, JSON.stringify(value));
    }
};

// 删除本地数据
Tool.removeItem = function (key) {
    if (key) {
        return localStorage.removeItem(key);
    }
    return localStorage.removeItem();
};

Tool.addEvent = function (el, event, fn, type) {
    var type = type || false;
    if ((typeof el === 'undefined' ? 'undefined' : _typeof(el)) !== 'object' || typeof event !== 'string' || typeof fn !== 'function' || typeof type !== 'boolean') {
        console.log('参数格式错误');
    }
    if (window.addEventListener) {
        return el.addEventListener(event, fn, type);
    } else {
        return el.attachEvent('on' + event, fn, type);
    }
};

exports.Tool = Tool;
exports.merged = _objMerged2.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(37);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = lib;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoData = exports.Header = exports.TipMsgSignin = exports.Loading = exports.UserHeadImg = exports.TabIcon = undefined;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _TabIcon = __webpack_require__(42);

var _TabIcon2 = _interopRequireDefault(_TabIcon);

var _UserHeadImg = __webpack_require__(44);

var _UserHeadImg2 = _interopRequireDefault(_UserHeadImg);

var _Loading = __webpack_require__(40);

var _Loading2 = _interopRequireDefault(_Loading);

var _TipMsgSignIn = __webpack_require__(43);

var _TipMsgSignIn2 = _interopRequireDefault(_TipMsgSignIn);

var _Header = __webpack_require__(39);

var _Header2 = _interopRequireDefault(_Header);

var _NoData = __webpack_require__(41);

var _NoData2 = _interopRequireDefault(_NoData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.TabIcon = _TabIcon2.default;
exports.UserHeadImg = _UserHeadImg2.default;
exports.Loading = _Loading2.default;
exports.TipMsgSignin = _TipMsgSignIn2.default;
exports.Header = _Header2.default;
exports.NoData = _NoData2.default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(5))(109);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(5))(62);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tool = __webpack_require__(2);

var _isomorphicFetch = __webpack_require__(33);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var target = 'https://cnodejs.org'; //目标网站

var actions = {
    //首页
    fetchList: function fetchList(url, options) {
        return function (dispatch, getState) {
            dispatch(actions.beginFetchList(options.tab));
            var address = target + _tool.Tool.setUrlParams(url, options);
            console.log(target);
            (0, _isomorphicFetch2.default)(address).then(function (res) {
                if (res.status != 200) {
                    dispatch(actions.failFetchList(res.statusText));
                }
                if (res.ok) {
                    res.json().then(function (data) {
                        dispatch(actions.doneFetchList(data.data, options.tab));
                    });
                }
            }).catch(function (e) {
                dispatch(actions.failFetchList(e.statusText));
            });
        };
    },

    beginFetchList: function beginFetchList(tab) {
        return {
            type: 'BEGIN_FETCH_LIST',
            tab: tab
        };
    },

    doneFetchList: function doneFetchList(data, tab) {
        return {
            type: 'DONE_FETCH_LIST',
            payload: data,
            tab: tab
        };
    },

    failFetchList: function failFetchList(errMsg) {
        return {
            type: 'FAIL_FETCH_LIST',
            error: new Error(errMsg)
        };
    },

    //详情页
    fetchTopic: function fetchTopic(url, options) {
        return function (dispatch, getState) {
            dispatch(actions.beginfetchTopic());
            var state = getState().fetchTopic;
            var address = target + _tool.Tool.setUrlParams(url, options);
            (0, _isomorphicFetch2.default)(address).then(function (res) {
                if (res.status != 200) {
                    dispatch(actions.failfetchTopic(res.statusText));
                }
                if (res.ok) {
                    res.json().then(function (data) {
                        dispatch(actions.donefetchTopic(data.data));
                    });
                }
            }).catch(function (e) {
                dispatch(actions.failfetchTopic(e.statusText));
            });
        };
    },

    beginfetchTopic: function beginfetchTopic() {
        return {
            type: 'BEGIN_FETCH_TOPIC'
        };
    },

    donefetchTopic: function donefetchTopic(data) {
        return {
            type: 'DONE_FETCH_TOPIC',
            payload: data
        };
    },

    failfetchTopic: function failfetchTopic(errMsg) {
        return {
            type: 'FAIL_FETCH_TOPIC',
            error: new Error(errMsg)
        };
    },

    //发表
    createTopic: function createTopic(url, options) {
        return function (dispatch, getState) {
            dispatch(actions.beginCreateTopic());
            var address = target + _tool.Tool.setUrlParams(url, options);
            (0, _isomorphicFetch2.default)(address).then(function (res) {
                if (res.status != 200) {
                    dispatch(actions.failCreateTopic(res.statusText));
                }
                if (res.ok) {
                    res.json().then(function (data) {
                        dispatch(actions.doneCreateTopic(data.data));
                    });
                }
            }).catch(function (e) {
                dispatch(actions.failCreateTopic(e.statusText));
            });
        };
    },

    beginCreateTopic: function beginCreateTopic() {
        return {
            type: 'BEGIN_CREATE_TOPIC'
        };
    },

    doneCreateTopic: function doneCreateTopic(data) {
        return {
            type: 'DONE_CREATE_TOPIC',
            payload: data
        };
    },

    failCreateTopic: function failCreateTopic(errMsg) {
        return {
            type: 'FAIL_CREATE_TOPIC',
            error: new Error(errMsg)
        };
    },

    //消息
    fetchMessage: function fetchMessage(url, options) {
        return function (dispatch, getState) {
            dispatch(actions.beginFetchMessage());
            var address = target + _tool.Tool.setUrlParams(url, options);
            (0, _isomorphicFetch2.default)(address).then(function (res) {
                if (res.status != 200) {
                    dispatch(actions.failFetchMessage(res.statusText));
                }
                if (res.ok) {
                    res.json().then(function (data) {
                        console.log(data.data);
                        dispatch(actions.doneFetchMessage(data.data));
                    });
                }
            }).catch(function (e) {
                dispatch(actions.failFetchMessage(e.statusText));
            });
        };
    },

    beginFetchMessage: function beginFetchMessage() {
        return {
            type: 'BEGIN_FETCH_MESSAGE'
        };
    },

    doneFetchMessage: function doneFetchMessage(data) {
        return {
            type: 'DONE_FETCH_MESSAGE',
            payload: data
        };
    },

    failFetchMessage: function failFetchMessage(errMsg) {
        return {
            type: 'FAIL_FETCH_MESSAGE',
            error: new Error(errMsg)
        };
    },

    //登录
    loginIn: function loginIn(data) {
        return {
            type: 'LOGIN_IN_SUCCESS',
            payload: data
        };
    },

    //退出登录
    loginOut: function loginOut() {
        return {
            type: 'LOGIN_OUT'
        };
    },

    //用户详情
    fetchDetail: function fetchDetail(url, options) {
        return function (dispatch, getState) {
            dispatch(actions.beginFetchDetail());
            var address = target + _tool.Tool.setUrlParams(url, options);
            (0, _isomorphicFetch2.default)(address).then(function (res) {
                if (res.status != 200) {
                    dispatch(actions.failFetchDetail(res.statusText));
                }
                if (res.ok) {
                    res.json().then(function (data) {
                        // console.log(data.data);
                        dispatch(actions.doneFetchDetail(data.data));
                    });
                }
            }).catch(function (e) {
                dispatch(actions.failFetchDetail(e.statusText));
            });
        };
    },

    beginFetchDetail: function beginFetchDetail() {
        return {
            type: 'BEGIN_FETCH_DETAIL'
        };
    },

    doneFetchDetail: function doneFetchDetail(data) {
        return {
            type: 'DONE_FETCH_DETAIL',
            payload: data
        };
    },

    failFetchDetail: function failFetchDetail(errMsg) {
        return {
            type: 'FAIL_FETCH_DETAIL',
            error: new Error(errMsg)
        };
    }

};

exports.default = actions;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var strictUriEncode = __webpack_require__(36);
var objectAssign = __webpack_require__(31);

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [encode(key, opts), '[', index, ']'].join('') : [encode(key, opts), '[', encode(index, opts), ']=', encode(value, opts)].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [encode(key, opts), '[]=', encode(value, opts)].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [encode(key, opts), '=', encode(value, opts)].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str, opts) {
	opts = objectAssign({ arrayFormat: 'none' }, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".topic-head {\n  height: 60px;\n  width: 100%;\n  background: #80bd01;\n  line-height: 60px;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n}\n.topic-head a {\n  position: absolute;\n  color: #fff;\n  top: 0;\n}\n.topic-head a i {\n  font-size: 24px;\n}\n.topic-head a.left {\n  left: 10px;\n}\n.topic-head a.right {\n  right: 10px;\n}\n.topic-head .title {\n  font-size: 20px;\n  color: #fff;\n  text-align: center;\n  font-weight: bold;\n}\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".data-load .msg {\n  line-height: 70px;\n  text-align: center;\n  font-size: 14px;\n}\n.data-load-true {\n  margin: 20px auto 20px auto;\n  position: relative;\n  -webkit-animation: rotate-forever 1s infinite linear;\n          animation: rotate-forever 1s infinite linear;\n  height: 30px;\n  width: 30px;\n  border: 4px solid #80bd01;\n  border-right-color: transparent;\n  border-radius: 50%;\n}\n.data-load-true .msg {\n  display: none;\n}\n@-webkit-keyframes rotate-forever {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n@keyframes rotate-forever {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "/*! https://github.com/lzxb/flex.css */[data-flex]{display:-webkit-box;display:-ms-flexbox;display:flex}[data-flex]>*{display:block}[data-flex]>[data-flex]{display:-webkit-box;display:-ms-flexbox;display:flex}[data-flex~=\"dir:left\"]{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row}[data-flex~=\"dir:right\"]{-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse;-webkit-box-pack:end}[data-flex~=\"dir:top\"]{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}[data-flex~=\"dir:bottom\"]{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse;-webkit-box-pack:end}[data-flex~=\"main:left\"]{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}[data-flex~=\"main:right\"]{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}[data-flex~=\"main:justify\"]{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}[data-flex~=\"main:center\"]{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}[data-flex~=\"cross:top\"]{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}[data-flex~=\"cross:bottom\"]{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}[data-flex~=\"cross:center\"]{-webkit-box-align:center;-ms-flex-align:center;align-items:center}[data-flex~=\"cross:baseline\"]{-webkit-box-align:baseline;-ms-flex-align:baseline;align-items:baseline}[data-flex~=\"cross:stretch\"]{-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch}[data-flex~=\"box:mean\"]>*,[data-flex~=\"box:first\"]>*,[data-flex~=\"box:last\"]>*,[data-flex~=\"box:justify\"]>*{width:0;height:auto;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1}[data-flex~=\"box:first\"]>:first-child,[data-flex~=\"box:last\"]>:last-child,[data-flex~=\"box:justify\"]>:first-child,[data-flex~=\"box:justify\"]>:last-child{width:auto;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:0;flex-shrink:0}[data-flex~=\"dir:top\"][data-flex~=\"box:mean\"]>*,[data-flex~=\"dir:top\"][data-flex~=\"box:first\"]>*,[data-flex~=\"dir:top\"][data-flex~=\"box:last\"]>*,[data-flex~=\"dir:top\"][data-flex~=\"box:justify\"]>*,[data-flex~=\"dir:bottom\"][data-flex~=\"box:mean\"]>*,[data-flex~=\"dir:bottom\"][data-flex~=\"box:first\"]>*,[data-flex~=\"dir:bottom\"][data-flex~=\"box:last\"]>*,[data-flex~=\"dir:bottom\"][data-flex~=\"box:justify\"]>*{width:auto;height:0;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1}[data-flex~=\"dir:top\"][data-flex~=\"box:first\"]>:first-child,[data-flex~=\"dir:top\"][data-flex~=\"box:last\"]>:last-child,[data-flex~=\"dir:top\"][data-flex~=\"box:justify\"]>:first-child,[data-flex~=\"dir:top\"][data-flex~=\"box:justify\"]>:last-child,[data-flex~=\"dir:bottom\"][data-flex~=\"box:first\"]>:first-child,[data-flex~=\"dir:bottom\"][data-flex~=\"box:last\"]>:last-child,[data-flex~=\"dir:bottom\"][data-flex~=\"box:justify\"]>:first-child [data-flex~=\"dir:bottom\"][data-flex~=\"box:justify\"]>:last-child{height:auto;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:0;flex-shrink:0}[data-flex-box=\"0\"]{-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:0;flex-shrink:0}[data-flex-box=\"1\"]{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1}[data-flex-box=\"2\"]{-webkit-box-flex:2;-ms-flex-positive:2;flex-grow:2;-ms-flex-negative:2;flex-shrink:2}[data-flex-box=\"3\"]{-webkit-box-flex:3;-ms-flex-positive:3;flex-grow:3;-ms-flex-negative:3;flex-shrink:3}[data-flex-box=\"4\"]{-webkit-box-flex:4;-ms-flex-positive:4;flex-grow:4;-ms-flex-negative:4;flex-shrink:4}[data-flex-box=\"5\"]{-webkit-box-flex:5;-ms-flex-positive:5;flex-grow:5;-ms-flex-negative:5;flex-shrink:5}[data-flex-box=\"6\"]{-webkit-box-flex:6;-ms-flex-positive:6;flex-grow:6;-ms-flex-negative:6;flex-shrink:6}[data-flex-box=\"7\"]{-webkit-box-flex:7;-ms-flex-positive:7;flex-grow:7;-ms-flex-negative:7;flex-shrink:7}[data-flex-box=\"8\"]{-webkit-box-flex:8;-ms-flex-positive:8;flex-grow:8;-ms-flex-negative:8;flex-shrink:8}[data-flex-box=\"9\"]{-webkit-box-flex:9;-ms-flex-positive:9;flex-grow:9;-ms-flex-negative:9;flex-shrink:9}[data-flex-box=\"10\"]{-webkit-box-flex:10;-ms-flex-positive:10;flex-grow:10;-ms-flex-negative:10;flex-shrink:10}", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: octicons-link;\n  src: url(data:font/woff;charset=utf-8;base64,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) format('woff');\n}\n\n.markdown-body {\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n  line-height: 1.5;\n  color: #24292e;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 16px;\n  line-height: 1.5;\n  word-wrap: break-word;\n}\n\n.markdown-body .pl-c {\n  color: #6a737d;\n}\n\n.markdown-body .pl-c1,\n.markdown-body .pl-s .pl-v {\n  color: #005cc5;\n}\n\n.markdown-body .pl-e,\n.markdown-body .pl-en {\n  color: #6f42c1;\n}\n\n.markdown-body .pl-smi,\n.markdown-body .pl-s .pl-s1 {\n  color: #24292e;\n}\n\n.markdown-body .pl-ent {\n  color: #22863a;\n}\n\n.markdown-body .pl-k {\n  color: #d73a49;\n}\n\n.markdown-body .pl-s,\n.markdown-body .pl-pds,\n.markdown-body .pl-s .pl-pse .pl-s1,\n.markdown-body .pl-sr,\n.markdown-body .pl-sr .pl-cce,\n.markdown-body .pl-sr .pl-sre,\n.markdown-body .pl-sr .pl-sra {\n  color: #032f62;\n}\n\n.markdown-body .pl-v,\n.markdown-body .pl-smw {\n  color: #e36209;\n}\n\n.markdown-body .pl-bu {\n  color: #b31d28;\n}\n\n.markdown-body .pl-ii {\n  color: #fafbfc;\n  background-color: #b31d28;\n}\n\n.markdown-body .pl-c2 {\n  color: #fafbfc;\n  background-color: #d73a49;\n}\n\n.markdown-body .pl-c2::before {\n  content: \"^M\";\n}\n\n.markdown-body .pl-sr .pl-cce {\n  font-weight: bold;\n  color: #22863a;\n}\n\n.markdown-body .pl-ml {\n  color: #735c0f;\n}\n\n.markdown-body .pl-mh,\n.markdown-body .pl-mh .pl-en,\n.markdown-body .pl-ms {\n  font-weight: bold;\n  color: #005cc5;\n}\n\n.markdown-body .pl-mi {\n  font-style: italic;\n  color: #24292e;\n}\n\n.markdown-body .pl-mb {\n  font-weight: bold;\n  color: #24292e;\n}\n\n.markdown-body .pl-md {\n  color: #b31d28;\n  background-color: #ffeef0;\n}\n\n.markdown-body .pl-mi1 {\n  color: #22863a;\n  background-color: #f0fff4;\n}\n\n.markdown-body .pl-mc {\n  color: #e36209;\n  background-color: #ffebda;\n}\n\n.markdown-body .pl-mi2 {\n  color: #f6f8fa;\n  background-color: #005cc5;\n}\n\n.markdown-body .pl-mdr {\n  font-weight: bold;\n  color: #6f42c1;\n}\n\n.markdown-body .pl-ba {\n  color: #586069;\n}\n\n.markdown-body .pl-sg {\n  color: #959da5;\n}\n\n.markdown-body .pl-corl {\n  text-decoration: underline;\n  color: #032f62;\n}\n\n.markdown-body .octicon {\n  display: inline-block;\n  vertical-align: text-top;\n  fill: currentColor;\n}\n\n.markdown-body a {\n  background-color: transparent;\n  -webkit-text-decoration-skip: objects;\n}\n\n.markdown-body a:active,\n.markdown-body a:hover {\n  outline-width: 0;\n}\n\n.markdown-body strong {\n  font-weight: inherit;\n}\n\n.markdown-body strong {\n  font-weight: bolder;\n}\n\n.markdown-body h1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n.markdown-body img {\n  border-style: none;\n}\n\n.markdown-body svg:not(:root) {\n  overflow: hidden;\n}\n\n.markdown-body code,\n.markdown-body kbd,\n.markdown-body pre {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\n.markdown-body hr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  height: 0;\n  overflow: visible;\n}\n\n.markdown-body input {\n  font: inherit;\n  margin: 0;\n}\n\n.markdown-body input {\n  overflow: visible;\n}\n\n.markdown-body [type=\"checkbox\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  padding: 0;\n}\n\n.markdown-body * {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n.markdown-body input {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\n\n.markdown-body a {\n  color: #0366d6;\n  text-decoration: none;\n}\n\n.markdown-body a:hover {\n  text-decoration: underline;\n}\n\n.markdown-body strong {\n  font-weight: 600;\n}\n\n.markdown-body hr {\n  height: 0;\n  margin: 15px 0;\n  overflow: hidden;\n  background: transparent;\n  border: 0;\n  border-bottom: 1px solid #dfe2e5;\n}\n\n.markdown-body hr::before {\n  display: table;\n  content: \"\";\n}\n\n.markdown-body hr::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.markdown-body table {\n  border-spacing: 0;\n  border-collapse: collapse;\n}\n\n.markdown-body td,\n.markdown-body th {\n  padding: 0;\n}\n\n.markdown-body h1,\n.markdown-body h2,\n.markdown-body h3,\n.markdown-body h4,\n.markdown-body h5,\n.markdown-body h6 {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.markdown-body h1 {\n  font-size: 32px;\n  font-weight: 600;\n}\n\n.markdown-body h2 {\n  font-size: 24px;\n  font-weight: 600;\n}\n\n.markdown-body h3 {\n  font-size: 20px;\n  font-weight: 600;\n}\n\n.markdown-body h4 {\n  font-size: 16px;\n  font-weight: 600;\n}\n\n.markdown-body h5 {\n  font-size: 14px;\n  font-weight: 600;\n}\n\n.markdown-body h6 {\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.markdown-body p {\n  margin-top: 0;\n  margin-bottom: 10px;\n}\n\n.markdown-body blockquote {\n  margin: 0;\n}\n\n.markdown-body ul,\n.markdown-body ol {\n  padding-left: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.markdown-body ol ol,\n.markdown-body ul ol {\n  list-style-type: lower-roman;\n}\n\n.markdown-body ul ul ol,\n.markdown-body ul ol ol,\n.markdown-body ol ul ol,\n.markdown-body ol ol ol {\n  list-style-type: lower-alpha;\n}\n\n.markdown-body dd {\n  margin-left: 0;\n}\n\n.markdown-body code {\n  font-family: \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n  font-size: 12px;\n}\n\n.markdown-body pre {\n  margin-top: 0;\n  margin-bottom: 0;\n  font: 12px \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n}\n\n.markdown-body .octicon {\n  vertical-align: text-bottom;\n}\n\n.markdown-body .pl-0 {\n  padding-left: 0 !important;\n}\n\n.markdown-body .pl-1 {\n  padding-left: 4px !important;\n}\n\n.markdown-body .pl-2 {\n  padding-left: 8px !important;\n}\n\n.markdown-body .pl-3 {\n  padding-left: 16px !important;\n}\n\n.markdown-body .pl-4 {\n  padding-left: 24px !important;\n}\n\n.markdown-body .pl-5 {\n  padding-left: 32px !important;\n}\n\n.markdown-body .pl-6 {\n  padding-left: 40px !important;\n}\n\n.markdown-body::before {\n  display: table;\n  content: \"\";\n}\n\n.markdown-body::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.markdown-body>*:first-child {\n  margin-top: 0 !important;\n}\n\n.markdown-body>*:last-child {\n  margin-bottom: 0 !important;\n}\n\n.markdown-body a:not([href]) {\n  color: inherit;\n  text-decoration: none;\n}\n\n.markdown-body .anchor {\n  float: left;\n  padding-right: 4px;\n  margin-left: -20px;\n  line-height: 1;\n}\n\n.markdown-body .anchor:focus {\n  outline: none;\n}\n\n.markdown-body p,\n.markdown-body blockquote,\n.markdown-body ul,\n.markdown-body ol,\n.markdown-body dl,\n.markdown-body table,\n.markdown-body pre {\n  margin-top: 0;\n  margin-bottom: 16px;\n}\n\n.markdown-body hr {\n  height: 0.25em;\n  padding: 0;\n  margin: 24px 0;\n  background-color: #e1e4e8;\n  border: 0;\n}\n\n.markdown-body blockquote {\n  padding: 0 1em;\n  color: #6a737d;\n  border-left: 0.25em solid #dfe2e5;\n}\n\n.markdown-body blockquote>:first-child {\n  margin-top: 0;\n}\n\n.markdown-body blockquote>:last-child {\n  margin-bottom: 0;\n}\n\n.markdown-body kbd {\n  display: inline-block;\n  padding: 3px 5px;\n  font-size: 11px;\n  line-height: 10px;\n  color: #444d56;\n  vertical-align: middle;\n  background-color: #fafbfc;\n  border: solid 1px #c6cbd1;\n  border-bottom-color: #959da5;\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 -1px 0 #959da5;\n          box-shadow: inset 0 -1px 0 #959da5;\n}\n\n.markdown-body h1,\n.markdown-body h2,\n.markdown-body h3,\n.markdown-body h4,\n.markdown-body h5,\n.markdown-body h6 {\n  margin-top: 24px;\n  margin-bottom: 16px;\n  font-weight: 600;\n  line-height: 1.25;\n}\n\n.markdown-body h1 .octicon-link,\n.markdown-body h2 .octicon-link,\n.markdown-body h3 .octicon-link,\n.markdown-body h4 .octicon-link,\n.markdown-body h5 .octicon-link,\n.markdown-body h6 .octicon-link {\n  color: #1b1f23;\n  vertical-align: middle;\n  visibility: hidden;\n}\n\n.markdown-body h1:hover .anchor,\n.markdown-body h2:hover .anchor,\n.markdown-body h3:hover .anchor,\n.markdown-body h4:hover .anchor,\n.markdown-body h5:hover .anchor,\n.markdown-body h6:hover .anchor {\n  text-decoration: none;\n}\n\n.markdown-body h1:hover .anchor .octicon-link,\n.markdown-body h2:hover .anchor .octicon-link,\n.markdown-body h3:hover .anchor .octicon-link,\n.markdown-body h4:hover .anchor .octicon-link,\n.markdown-body h5:hover .anchor .octicon-link,\n.markdown-body h6:hover .anchor .octicon-link {\n  visibility: visible;\n}\n\n.markdown-body h1 {\n  padding-bottom: 0.3em;\n  font-size: 2em;\n  border-bottom: 1px solid #eaecef;\n}\n\n.markdown-body h2 {\n  padding-bottom: 0.3em;\n  font-size: 1.5em;\n  border-bottom: 1px solid #eaecef;\n}\n\n.markdown-body h3 {\n  font-size: 1.25em;\n}\n\n.markdown-body h4 {\n  font-size: 1em;\n}\n\n.markdown-body h5 {\n  font-size: 0.875em;\n}\n\n.markdown-body h6 {\n  font-size: 0.85em;\n  color: #6a737d;\n}\n\n.markdown-body ul,\n.markdown-body ol {\n  padding-left: 2em;\n}\n\n.markdown-body ul ul,\n.markdown-body ul ol,\n.markdown-body ol ol,\n.markdown-body ol ul {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.markdown-body li>p {\n  margin-top: 16px;\n}\n\n.markdown-body li+li {\n  margin-top: 0.25em;\n}\n\n.markdown-body dl {\n  padding: 0;\n}\n\n.markdown-body dl dt {\n  padding: 0;\n  margin-top: 16px;\n  font-size: 1em;\n  font-style: italic;\n  font-weight: 600;\n}\n\n.markdown-body dl dd {\n  padding: 0 16px;\n  margin-bottom: 16px;\n}\n\n.markdown-body table {\n  display: block;\n  width: 100%;\n  overflow: auto;\n}\n\n.markdown-body table th {\n  font-weight: 600;\n}\n\n.markdown-body table th,\n.markdown-body table td {\n  padding: 6px 13px;\n  border: 1px solid #dfe2e5;\n}\n\n.markdown-body table tr {\n  background-color: #fff;\n  border-top: 1px solid #c6cbd1;\n}\n\n.markdown-body table tr:nth-child(2n) {\n  background-color: #f6f8fa;\n}\n\n.markdown-body img {\n  max-width: 100%;\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  background-color: #fff;\n}\n\n.markdown-body code {\n  padding: 0;\n  padding-top: 0.2em;\n  padding-bottom: 0.2em;\n  margin: 0;\n  font-size: 85%;\n  background-color: rgba(27,31,35,0.05);\n  border-radius: 3px;\n}\n\n.markdown-body code::before,\n.markdown-body code::after {\n  letter-spacing: -0.2em;\n  content: \"\\A0\";\n}\n\n.markdown-body pre {\n  word-wrap: normal;\n}\n\n.markdown-body pre>code {\n  padding: 0;\n  margin: 0;\n  font-size: 100%;\n  word-break: normal;\n  white-space: pre;\n  background: transparent;\n  border: 0;\n}\n\n.markdown-body .highlight {\n  margin-bottom: 16px;\n}\n\n.markdown-body .highlight pre {\n  margin-bottom: 0;\n  word-break: normal;\n}\n\n.markdown-body .highlight pre,\n.markdown-body pre {\n  padding: 16px;\n  overflow: auto;\n  font-size: 85%;\n  line-height: 1.45;\n  background-color: #f6f8fa;\n  border-radius: 3px;\n}\n\n.markdown-body pre code {\n  display: inline;\n  max-width: auto;\n  padding: 0;\n  margin: 0;\n  overflow: visible;\n  line-height: inherit;\n  word-wrap: normal;\n  background-color: transparent;\n  border: 0;\n}\n\n.markdown-body pre code::before,\n.markdown-body pre code::after {\n  content: normal;\n}\n\n.markdown-body .full-commit .btn-outline:not(:disabled):hover {\n  color: #005cc5;\n  border-color: #005cc5;\n}\n\n.markdown-body kbd {\n  display: inline-block;\n  padding: 3px 5px;\n  font: 11px \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n  line-height: 10px;\n  color: #444d56;\n  vertical-align: middle;\n  background-color: #fafbfc;\n  border: solid 1px #d1d5da;\n  border-bottom-color: #c6cbd1;\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 -1px 0 #c6cbd1;\n          box-shadow: inset 0 -1px 0 #c6cbd1;\n}\n\n.markdown-body :checked+.radio-label {\n  position: relative;\n  z-index: 1;\n  border-color: #0366d6;\n}\n\n.markdown-body .task-list-item {\n  list-style-type: none;\n}\n\n.markdown-body .task-list-item+.task-list-item {\n  margin-top: 3px;\n}\n\n.markdown-body .task-list-item input {\n  margin: 0 0.2em 0.25em -1.6em;\n  vertical-align: middle;\n}\n\n.markdown-body hr {\n  border-bottom-color: #eee;\n}\n", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".topic-create .item {\n  padding: 10px 10px;\n  border-bottom: 1px solid #eee;\n  color: #444;\n}\n.topic-create .key {\n  width: 40px;\n  line-height: 28px;\n  font-size: 14px;\n  color: #999;\n}\n.topic-create select {\n  display: block;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  width: 100%;\n  height: 28px;\n  line-height: 28px;\n  border-radius: 5px;\n  font-size: 13px;\n  color: #222;\n}\n.topic-create input {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  width: 100%;\n  line-height: 28px;\n  font-size: 13px;\n  border-radius: 5px;\n}\n.topic-create textarea {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  width: 100%;\n  height: 300px;\n  line-height: 24px;\n  font-size: 13px;\n  resize: none;\n  border-radius: 5px;\n}\n", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".index-list {\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  position: absolute;\n  top: 38px;\n  bottom: 40px;\n  left: 0;\n  right: 0;\n  background: #fff;\n  color: #ccc;\n}\n.index-list li {\n  padding: 10px;\n  border-bottom: 1px solid #ddd;\n  font-size: 0;\n}\n.index-list .tit {\n  overflow: hidden;\n  height: 28px;\n  line-height: 28px;\n  font-size: 16px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  color: #666;\n}\n.index-list .author {\n  padding-right: 5px;\n}\n.index-list .con {\n  line-height: 20px;\n  font-size: 12px;\n  color: #666;\n}\n.index-list time {\n  font-size: 12px;\n}\n.index-list .bottom {\n  margin-top: 5px;\n}\n.index-list .user-headimg {\n  width: 40px;\n  height: 40px;\n  border-radius: 20px;\n  background-size: cover;\n}\n.index-list .font .iconfont {\n  padding: 3px 5px;\n  margin-right: 5px;\n  border-radius: 5px;\n  color: #fff;\n}\n.topNav {\n  text-align: center;\n  background: #80bd01;\n  color: #eee;\n  height: 38px;\n  line-height: 38px;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n}\n.topNav a {\n  color: #eee;\n  padding: 3px 10px;\n  border-radius: 3px;\n}\n.topNav .on a {\n  background: #5e8a01;\n}\n.nav {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  text-align: center;\n  height: 40px;\n  line-height: 40px;\n  background: #80bd01;\n}\n.nav a {\n  color: #eee;\n}\n.active {\n  background: #a2f001;\n}\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "/*\n    用户头像\n*/\n.user-headimg {\n  width: 38px;\n  height: 38px;\n  margin-right: 10px;\n  border-radius: 50%;\n  border: 1px solid #ddd;\n  background-size: cover;\n  background-color: #eee;\n}\n/*\n    登录\n*/\n.signin {\n  height: 480px;\n}\n.signin .center {\n  width: 280px;\n}\n.signin .text {\n  margin-bottom: 30px;\n}\n.signin .text input {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  width: 100%;\n  padding: 5px 10px;\n  line-height: 28px;\n  border-radius: 5px;\n  border: 1px solid #eee;\n  font-size: 13px;\n}\n.signin .btn {\n  display: block;\n  width: 100%;\n  padding: 5px 10px;\n  line-height: 28px;\n  border-radius: 5px;\n  text-align: center;\n  font-size: 13px;\n  color: #fff;\n  background: #80bd01;\n}\n.signin .loginout {\n  background: #e63e3e;\n}\n.signin .btn-red {\n  background: #e63e3e;\n}\n/*\n    个人中心\n*/\n.user-index .headimg {\n  padding: 20px;\n  background: #87c701;\n}\n.user-index .headimg .user-headimg {\n  width: 80px;\n  height: 80px;\n}\n.user-index .name {\n  padding-top: 10px;\n  line-height: 24px;\n  font-size: 16px;\n  color: #fff;\n}\n.user-index .score {\n  font-size: 12px;\n  color: #eee;\n}\n.user-index .tab-nav {\n  text-align: center;\n  background: #eee;\n}\n.user-index .tab-nav li {\n  line-height: 38px;\n  border-bottom: 3px solid transparent;\n}\n.user-index .tab-nav .on {\n  border-bottom: 3px solid #80bd01;\n}\n.user-index .list {\n  display: none;\n}\n.user-index .list a {\n  overflow: hidden;\n  height: 28px;\n  padding: 5px 10px;\n  line-height: 28px;\n  border-bottom: 1px solid #eee;\n}\n.user-index .list a .tit {\n  font-size: 14px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.user-index .list a time {\n  padding-left: 20px;\n  font-size: 12px;\n  color: #aaa;\n}\n/*\n    我的消息\n*/\n.msg-box .list li {\n  padding: 10px;\n  border-bottom: 1px solid #eee;\n}\n.msg-box .list li a {\n  color: #80bd01;\n}\n.msg-box .list li .name {\n  font-weight: bold;\n  line-height: 28px;\n}\n.msg-box .list li .name time {\n  padding-left: 5px;\n  font-size: 12px;\n  font-weight: normal;\n  color: #999;\n}\n.msg-box .list li .content {\n  padding: 5px 0;\n}\n.msg-box .list li .dian-true {\n  display: none;\n}\n.msg-box .list li .dian-false {\n  width: 8px;\n  height: 8px;\n  margin-right: 5px;\n  border-radius: 50%;\n  background: red;\n}\n", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".article {\n  margin-top: 60px;\n}\n.topic .user {\n  position: relative;\n  padding: 10px;\n  line-height: 20px;\n  font-size: 12px;\n  border-bottom: 1px solid #ddd;\n}\n.topic .user .user-headimg {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background-size: cover;\n}\n.topic .user .name {\n  font-size: 14px;\n  color: #80bd01;\n}\n.topic .user .lou {\n  line-height: 14px;\n  font-size: 14px;\n  color: #aaa;\n}\n.topic .user time {\n  padding-left: 5px;\n  line-height: 14px;\n  font-size: 14px;\n  color: #666;\n}\n.topic .user .qt div {\n  padding-right: 5px;\n}\n.topic .user .font {\n  position: absolute;\n  top: 0;\n  right: 0;\n}\n.topic .user .font .iconfont {\n  width: 60px;\n  height: 60px;\n  line-height: 60px;\n  text-align: center;\n  font-size: 32px;\n  color: #fff;\n  opacity: 0.8;\n}\n.topic .tit2 {\n  padding: 10px;\n  font-size: 18px;\n  background: #eee;\n}\n.topic .content {\n  overflow: hidden;\n  padding: 10px;\n  line-height: 24px;\n  font-size: 13px;\n}\n.topic .tit3 {\n  padding: 5px 10px;\n  line-height: 24px;\n  border-left: 8px solid #80bd01;\n  background: #eee;\n  font-weight: normal;\n  font-size: 14px;\n}\n.topic .tit3 em {\n  font-style: normal;\n  color: #80bd01;\n}\n.re-list {\n  margin-bottom: 20px;\n}\n.re-list li {\n  padding: 10px 10px 0 10px;\n  border-bottom: 1px solid #ddd;\n}\n.re-list li .user-headimg {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background-size: cover;\n}\n.re-list li .name {\n  font-size: 14px;\n  color: #80bd01;\n}\n.re-list li .lou {\n  line-height: 14px;\n  font-size: 14px;\n  color: #aaa;\n}\n.re-list li time {\n  padding-left: 5px;\n  line-height: 14px;\n  font-size: 14px;\n  color: #666;\n}\n.re-list li .bottom .font {\n  position: relative;\n  padding: 10px;\n}\n.re-list li .bottom .font em {\n  font-size: 13px;\n  font-style: normal;\n}\n.re-list li .bottom .font-true {\n  color: #80bd01;\n}\n.re-list a {\n  color: #80bd01;\n}\n.reply-box {\n  padding: 10px;\n}\n.reply-box .text {\n  margin-bottom: 10px;\n}\n.reply-box .text textarea {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  width: 100%;\n  height: 120px;\n  padding: 10px;\n  line-height: 24px;\n  border-radius: 5px;\n  border: 1px solid #ddd;\n  font-size: 13px;\n  resize: none;\n}\n.reply-box .btn {\n  padding: 5px 30px;\n  line-height: 24px;\n  border-radius: 5px;\n  border: 1px solid #6fa401;\n  font-size: 14px;\n  color: #fff;\n  background: #80bd01;\n}\n.tip-msg-signin {\n  padding: 30px 30px 50px 30px;\n  text-align: center;\n}\n.tip-msg-signin a {\n  color: #80bd01;\n}\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "/*\n    用户头像\n*/\n.user-headimg {\n  width: 38px;\n  height: 38px;\n  margin-right: 10px;\n  border-radius: 50%;\n  border: 1px solid #ddd;\n  background-size: cover;\n  background-color: #eee;\n}\n/*\n    登录\n*/\n.signin {\n  height: 480px;\n}\n.signin .center {\n  width: 280px;\n}\n.signin .text {\n  margin-bottom: 30px;\n}\n.signin .text input {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  width: 100%;\n  padding: 5px 10px;\n  line-height: 28px;\n  border-radius: 5px;\n  border: 1px solid #eee;\n  font-size: 13px;\n}\n.signin .btn {\n  display: block;\n  width: 100%;\n  padding: 5px 10px;\n  line-height: 28px;\n  border-radius: 5px;\n  text-align: center;\n  font-size: 13px;\n  color: #fff;\n  background: #80bd01;\n}\n.signin .btn-red {\n  background: #e63e3e;\n}\n.user-index .headimg {\n  padding: 20px;\n  background: #87c701;\n}\n.user-index .headimg .user-headimg {\n  width: 80px;\n  height: 80px;\n}\n.user-index .name {\n  padding-top: 10px;\n  line-height: 24px;\n  font-size: 16px;\n  color: #fff;\n}\n.user-index .score {\n  font-size: 12px;\n  color: #eee;\n}\n.user-index .tab-nav {\n  text-align: center;\n  background: #eee;\n}\n.user-index .tab-nav li {\n  line-height: 38px;\n  border-bottom: 3px solid transparent;\n}\n.user-index .tab-nav .on {\n  border-bottom: 3px solid #80bd01;\n}\n.user-index .list {\n  display: none;\n}\n.user-index .list a {\n  overflow: hidden;\n  height: 28px;\n  padding: 5px 10px;\n  line-height: 28px;\n  border-bottom: 1px solid #eee;\n}\n.user-index .list a .tit {\n  font-size: 14px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n.user-index .list a time {\n  padding-left: 20px;\n  font-size: 12px;\n  color: #aaa;\n}\n", ""]);

// exports


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "a,\nul,\ni,\np,\nh3,\nli,\ndiv {\n  padding: 0;\n  margin: 0;\n}\na {\n  text-decoration: none;\n}\n.icon-top {\n  background: red;\n}\n.icon-good {\n  background: blue;\n}\n.icon-share {\n  background: green;\n}\n.icon-ask {\n  background: pink;\n}\n.icon-job {\n  background: #00B38A;\n}\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in\n *    IE on Windows Phone and in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57- and Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers (opinionated).\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: sans-serif; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails, /* 1 */\nmenu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* Hidden\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}\n", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "\r\n@font-face {font-family: 'iconfont';\r\n    src: url(" + __webpack_require__(26) + "); /* IE9*/\r\n    src: url(" + __webpack_require__(26) + "?#iefix) format('embedded-opentype'), \r\n    url(" + __webpack_require__(63) + ") format('woff'), \r\n    url(" + __webpack_require__(62) + ") format('truetype'), \r\n    url(" + __webpack_require__(61) + "#iconfont) format('svg'); /* iOS 4.1- */\r\n}\r\n.iconfont {\r\n  font-family:\"iconfont\" !important;\r\n  font-size:16px;\r\n  font-style:normal;\r\n  -webkit-font-smoothing: antialiased;\r\n  -webkit-text-stroke-width: 0.2px;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n.icon-huifu:before { content: \"\\E608\"; }\r\n.icon-job:before { content: \"\\E602\"; }\r\n.icon-fanhui:before { content: \"\\E607\"; }\r\n.icon-dianzan:before { content: \"\\E609\"; }\r\n.icon-shouye:before { content: \"\\E600\"; }\r\n.icon-fabu:before { content: \"\\E60B\"; }\r\n.icon-share:before { content: \"\\E603\"; }\r\n.icon-wode:before { content: \"\\E601\"; }\r\n.icon-good:before { content: \"\\E604\"; }\r\n.icon-xiaoxi:before { content: \"\\E60A\"; }\r\n.icon-top:before { content: \"\\E606\"; }\r\n.icon-ask:before { content: \"\\E605\"; }\r\n.icon-tuichu:before { content: \"\\E60C\"; }\r\n", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(5))(108);

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(5))(8);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(23);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _tool = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//回复框

var ReplyBox = function (_Component) {
    _inherits(ReplyBox, _Component);

    function ReplyBox(props) {
        _classCallCheck(this, ReplyBox);

        var _this = _possibleConstructorReturn(this, (ReplyBox.__proto__ || Object.getPrototypeOf(ReplyBox)).call(this, props));

        _this.state = { btnname: '回复'

            // 提交回复
        };_this.submit = function () {
            _this.state = { btnname: '提交中...' };
            var data = _this.props.data;
            console.log(data);
            if (data.reply_id) {
                data.content = '[@' + _this.props.loginname + '](/user/' + _this.props.loginname + ') ' + _this.refs.content.value;
            } else {
                data.content = _this.refs.content.value;
            }
            if (data.content == '') {
                return alert('回复内容不能为空！');
            }
            data.content += '\n\r</br>-----来自<a href="https://loudou140806.github.io/cnode/" target="_blank">cnode手机版</a>';
            _tool.Tool.post('/api/v1//topic/' + data.id + '/replies', data, function (res) {
                _this.setState({ btnname: '回复成功，刷新页面中..' });
                _this.refs.content.value = '';
                _tool.Tool.get('/api/v1//topic/' + data.id, {}, function (res) {
                    _this.props.reLoadData(res.data); //刷新页面
                    _this.setState({ btnname: '回复' });
                }, function () {
                    _this.state = { btnname: '刷新失败，请手动刷新试试' };
                });
            }, function (res) {
                _this.setState({ btnname: '回复失败' });
            });
        };

        return _this;
    }

    _createClass(ReplyBox, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'reply-box', style: { display: this.props.display } },
                _react2.default.createElement(
                    'div',
                    { className: 'text' },
                    _react2.default.createElement('textarea', { ref: 'content', placeholder: this.props.placeholder })
                ),
                _react2.default.createElement(
                    'div',
                    { 'data-flex': 'main:right' },
                    _react2.default.createElement(
                        'button',
                        { className: 'btn', onClick: this.submit },
                        this.state.btnname
                    )
                )
            );
        }
    }]);

    return ReplyBox;
}(_react.Component);

ReplyBox.defaultProps = {
    display: 'block',
    placeholder: '回复支持Markdown语法,请注意标记代码'
};

exports.default = ReplyBox;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "iconfont.eot";

/***/ }),
/* 27 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(23);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = __webpack_require__(7);

var _store = __webpack_require__(60);

var _store2 = _interopRequireDefault(_store);

var _route = __webpack_require__(59);

var _route2 = _interopRequireDefault(_route);

__webpack_require__(66);

__webpack_require__(64);

__webpack_require__(67);

__webpack_require__(65);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//markdown css

function App() {
    return _react2.default.createElement(
        _reactRedux.Provider,
        { store: _store2.default },
        _react2.default.createElement(_route2.default, null)
    );
}

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('root'));

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(5))(127);

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(5))(128);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(5))(4);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(5))(9);

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
__webpack_require__(38);
module.exports = self.fetch.bind(self);

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (merged) {
    'use strict';

    if ("function" === 'function' && _typeof(__webpack_require__(27)) === 'object' && __webpack_require__(27)) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (merged),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = merged();
    } else {
        window.merged = merged();
    }
}(function () {
    'use strict';

    /**
     * (复制对象)
     * 
     * @returns (返回复制的对象)
     */

    function merged() {
        for (var len = arguments.length, arg = Array(len), key = 0; key < len; key++) {
            arg[key] = arguments[key];
        }

        var obj = {};
        for (var i = 0; i < arg.length; i++) {
            for (var key in arg[i]) {
                var curObj = arg[i][key];
                if (isJson(curObj)) {
                    if (isJson(obj[key])) {
                        obj[key] = merged(obj[key], curObj); // obj 此属性已经是对象，则和该对象原来的属性合并
                    } else {
                        obj[key] = merged(curObj); // obj 此属性不是对象，则和该对象原来的属性合并
                    }
                } else if (isArray(curObj)) {
                    //此对象是数组
                    obj[key] = mergedArr(curObj);
                } else {
                    obj[key] = curObj; //属性不是obj
                }
            }
        }
        return obj;
    };

    /**
     * (复制数组)
     * 
     * @param arr (description)
     */
    function mergedArr(arr) {
        var arr2 = [];

        for (var i = 0; i < arr.length; i++) {
            var curObj = arr[i];
            if (isJson(curObj)) {
                arr2[i] = merged(curObj); // 复制对象
            } else if (isArray(curObj)) {
                //复制数组
                arr2[i] = mergedArr(curObj);
            } else {
                arr2[i] = curObj; //属性不是obj
            }
        }
        return arr2;
    }

    function isJson(obj) {
        return (typeof obj === 'undefined' ? 'undefined' : typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length; //true 是 false不是
    };
    function isArray(arr) {
        return Object.prototype.toString.call(arr).toLowerCase() === '[object array]'; //true 是 false不是
    }
    return merged;
});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function (self) {
  'use strict';

  if (self.fetch) {
    return;
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

    var isDataView = function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj);
    };

    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function next() {
        var value = items.shift();
        return { done: value === undefined, value: value };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ',' + value : value;
  };

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('');
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type');
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }

    this.text = function () {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text');
      } else {
        return Promise.resolve(this._bodyText);
      }
    };

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  Request.prototype.clone = function () {
    return new Request(this, { body: this._bodyInit });
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    rawHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = 'status' in options ? options.status : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status: status, headers: { location: url } });
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function (input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : undefined);

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

__webpack_require__(68);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_Component) {
    _inherits(Header, _Component);

    function Header() {
        _classCallCheck(this, Header);

        return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
    }

    _createClass(Header, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                leftIcon = _props.leftIcon,
                leftClick = _props.leftClick,
                rightTo = _props.rightTo,
                rightIcon = _props.rightIcon,
                rightClick = _props.rightClick,
                title = _props.title;

            var left = null;
            if (leftIcon) {
                left = _react2.default.createElement(
                    'a',
                    { onClick: leftClick, className: 'left' },
                    _react2.default.createElement('i', { className: 'iconfont icon-' + leftIcon })
                );
            }
            var right = null;
            if (rightTo && rightIcon) {
                right = _react2.default.createElement(
                    _reactRouterDom.NavLink,
                    { to: rightTo, className: 'right' },
                    _react2.default.createElement('i', { className: 'iconfont icon-' + rightIcon })
                );
            } else if (rightClick && rightIcon) {
                right = _react2.default.createElement(
                    'a',
                    { onClick: rightClick, className: 'right' },
                    _react2.default.createElement('i', { className: 'iconfont icon-' + rightIcon })
                );
            }
            return _react2.default.createElement(
                'div',
                { className: 'topic-head' },
                left,
                _react2.default.createElement(
                    'h3',
                    { className: 'title' },
                    title
                ),
                right
            );
        }
    }]);

    return Header;
}(_react.Component);

exports.default = Header;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(69);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loading = function (_React$Component) {
    _inherits(Loading, _React$Component);

    function Loading() {
        _classCallCheck(this, Loading);

        return _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).apply(this, arguments));
    }

    _createClass(Loading, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                loadAnimation = _props.loadAnimation,
                loadMsg = _props.loadMsg;

            return _react2.default.createElement(
                'div',
                { className: 'data-load data-load-' + loadAnimation },
                loadAnimation ? _react2.default.createElement(
                    'div',
                    { className: 'msg' },
                    loadMsg
                ) : null
            );
        }
    }]);

    return Loading;
}(_react2.default.Component);

Loading.defaultProps = {
    loadAnimation: true, //默认显示加载动画
    loadMsg: '正在加载中'
};

exports.default = Loading;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NoData = function (_Component) {
    _inherits(NoData, _Component);

    function NoData() {
        _classCallCheck(this, NoData);

        return _possibleConstructorReturn(this, (NoData.__proto__ || Object.getPrototypeOf(NoData)).apply(this, arguments));
    }

    _createClass(NoData, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { style: { marginTop: '20px', textAlign: 'center', color: '#333', padding: '20px' } },
                '\u6682\u65E0\u8BB0\u5F55'
            );
        }
    }]);

    return NoData;
}(_react.Component);

exports.default = NoData;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabIcon = function (_Component) {
    _inherits(TabIcon, _Component);

    function TabIcon() {
        _classCallCheck(this, TabIcon);

        return _possibleConstructorReturn(this, (TabIcon.__proto__ || Object.getPrototypeOf(TabIcon)).apply(this, arguments));
    }

    _createClass(TabIcon, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                tab = _props.tab,
                top = _props.top,
                good = _props.good;


            if (top) {
                tab = 'top';
            } else if (good) {
                tab = 'good';
            }

            return _react2.default.createElement('i', { className: 'iconfont icon-' + tab });
        }
    }]);

    return TabIcon;
}(_react.Component);

exports.default = TabIcon;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TipMsgSignin = function (_React$Component) {
    _inherits(TipMsgSignin, _React$Component);

    function TipMsgSignin() {
        _classCallCheck(this, TipMsgSignin);

        return _possibleConstructorReturn(this, (TipMsgSignin.__proto__ || Object.getPrototypeOf(TipMsgSignin)).apply(this, arguments));
    }

    _createClass(TipMsgSignin, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'tip-msg-signin' },
                '\u4F60\u8FD8\u672A\u767B\u5F55\uFF0C\u8BF7\u5148',
                _react2.default.createElement(
                    _reactRouterDom.NavLink,
                    { to: '/login' },
                    '\u767B\u5F55'
                )
            );
        }
    }]);

    return TipMsgSignin;
}(_react2.default.Component);

exports.default = TipMsgSignin;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserHeadImg = function (_Component) {
    _inherits(UserHeadImg, _Component);

    function UserHeadImg() {
        _classCallCheck(this, UserHeadImg);

        return _possibleConstructorReturn(this, (UserHeadImg.__proto__ || Object.getPrototypeOf(UserHeadImg)).apply(this, arguments));
    }

    _createClass(UserHeadImg, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement('div', { className: 'user-headimg', style: { backgroundImage: 'url(' + this.props.url + ')' } });
        }
    }]);

    return UserHeadImg;
}(_react.Component);

exports.default = UserHeadImg;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewTopic = function (_Component) {
    _inherits(NewTopic, _Component);

    function NewTopic() {
        _classCallCheck(this, NewTopic);

        return _possibleConstructorReturn(this, (NewTopic.__proto__ || Object.getPrototypeOf(NewTopic)).apply(this, arguments));
    }

    _createClass(NewTopic, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "topic-create" },
                _react2.default.createElement(
                    "div",
                    { className: "item" },
                    _react2.default.createElement(
                        "select",
                        { name: "tab", defaultValue: this.props.tab, onInput: this.props.tabInput },
                        _react2.default.createElement(
                            "option",
                            { value: "" },
                            "\u8BF7\u9009\u62E9\u53D1\u8868\u7C7B\u578B"
                        ),
                        _react2.default.createElement(
                            "option",
                            { value: "share" },
                            "\u5206\u4EAB"
                        ),
                        _react2.default.createElement(
                            "option",
                            { value: "ask" },
                            "\u95EE\u7B54"
                        ),
                        _react2.default.createElement(
                            "option",
                            { value: "job" },
                            "\u62DB\u8058"
                        ),
                        _react2.default.createElement(
                            "option",
                            { value: "dev" },
                            "\u6D4B\u8BD5"
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "item" },
                    _react2.default.createElement("input", { type: "text", defaultValue: this.props.title, onInput: this.props.titleInput, placeholder: "\u6807\u9898\u5B57\u6570 10 \u5B57\u4EE5\u4E0A" })
                ),
                _react2.default.createElement(
                    "div",
                    { className: "item" },
                    _react2.default.createElement("textarea", { defaultValue: this.props.content, onInput: this.props.contentInput, placeholder: "\u5185\u5BB9\u5B57\u6570 30 \u5B57\u4EE5\u4E0A" })
                )
            );
        }
    }]);

    return NewTopic;
}(_react.Component);

exports.default = NewTopic;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(24);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = __webpack_require__(1);

var _reactRedux = __webpack_require__(7);

var _redux = __webpack_require__(8);

var _actions = __webpack_require__(9);

var _actions2 = _interopRequireDefault(_actions);

var _tool = __webpack_require__(2);

var _NewTopic = __webpack_require__(45);

var _NewTopic2 = _interopRequireDefault(_NewTopic);

__webpack_require__(70);

var _components = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Create = function (_Component) {
    _inherits(Create, _Component);

    function Create(props) {
        _classCallCheck(this, Create);

        // 初始化组件状态
        var _this = _possibleConstructorReturn(this, (Create.__proto__ || Object.getPrototypeOf(Create)).call(this, props));

        _this.state = {
            title: '',
            tab: '',
            content: '',
            accesstoken: _this.props.User ? _this.props.User.accesstoken : ''
        };
        console.log(_this.props.User);
        _this.postState = false;
        // 发表主题
        _this.rightClick = function () {
            var state = _this.state;

            if (_this.postState) return false;

            if (!state.tab) {
                return alert('请选择发表类型');
            } else if (state.title.length < 10) {
                return alert('标题字数10字以上');
            } else if (state.content.length < 30) {
                return alert('内容字数30字以上');
            }
            _this.postState = true;
            _tool.Tool.post('/api/v1/topics', _this.state, function (res) {
                if (res.success) {
                    _this.context.router.history.push({
                        pathname: '/topic/' + res.topic_id
                    });
                } else {
                    alert('发表失败');
                    _this.postState = false;
                }
            }, function () {
                alert('发表失败');
                _this.postState = false;
            });
        };

        //监听用户选择发表类型

        _this.tabInput = function (e) {
            _this.state.tab = e.target.value;
        };

        // 监听用户输入标题
        _this.titleInput = function (e) {
            _this.state.title = e.target.value;
        };

        //监听用户输入内容
        _this.contentInput = function (e) {
            _this.state.content = e.target.value;
        };

        return _this;
    }

    _createClass(Create, [{
        key: 'render',
        value: function render() {
            var User = this.props.User;

            var headerSet = {};
            var main = null;
            if (!User) {
                main = _react2.default.createElement(_components.TipMsgSignin, null);
            } else {
                main = _react2.default.createElement(_NewTopic2.default, _extends({}, this.state, { tabInput: this.tabInput, titleInput: this.titleInput, contentInput: this.contentInput }));
                headerSet = {
                    rightIcon: 'fabu',
                    rightClick: this.rightClick
                };
            }
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_components.Header, _extends({ title: '\u53D1\u8868\u4E3B\u9898' }, headerSet)),
                _react2.default.createElement(
                    'div',
                    { style: { marginTop: '60px' } },
                    main
                )
            );
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate() {
            return false;
        }
    }]);

    return Create;
}(_react.Component);

Create.contextTypes = {
    router: _propTypes2.default.object.isRequired
};

exports.default = (0, _reactRedux.connect)(function (state) {
    return { User: state.User };
}, function (dispatch) {
    return { createAction: (0, _redux.bindActionCreators)(_actions2.default, dispatch) };
})(Create); //连接redux

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _redux = __webpack_require__(8);

var _reactRedux = __webpack_require__(7);

var _reactRouterDom = __webpack_require__(1);

var _queryString = __webpack_require__(10);

var _queryString2 = _interopRequireDefault(_queryString);

var _actions = __webpack_require__(9);

var _actions2 = _interopRequireDefault(_actions);

var _tool = __webpack_require__(2);

var _style2 = __webpack_require__(75);

var _style3 = _interopRequireDefault(_style2);

__webpack_require__(71);

var _nav = __webpack_require__(49);

var _nav2 = _interopRequireDefault(_nav);

var _list = __webpack_require__(48);

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home = function (_Component) {
    _inherits(Home, _Component);

    function Home(props) {
        _classCallCheck(this, Home);

        var _this = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));

        _this.handleScroll = function (e) {
            var target = e.target;
            var scrollTop = target.scrollTop,
                scrollHeight = target.scrollHeight - 78,
                containerHeight = window.innerHeight;
            var _this$props$state = _this.props.state,
                page = _this$props$state.page,
                limit = _this$props$state.limit,
                mdrender = _this$props$state.mdrender,
                isFetching = _this$props$state.isFetching;

            var tab = _queryString2.default.parse(_this.props.location.search).tab || 'all';
            if (scrollTop > scrollHeight - containerHeight - 30) {
                if (isFetching) return;
                _this.props.actions.fetchList('/api/v1/topics', {
                    tab: tab,
                    limit: limit,
                    page: page,
                    mdrender: mdrender
                });
            }
        };
        _this.changeTab = function (tab) {
            var _this$props$state2 = _this.props.state,
                limit = _this$props$state2.limit,
                mdrender = _this$props$state2.mdrender;

            var page = _this.props.state.page;
            if (tab !== _this.props.state.tab) {
                page = 1;
            }
            _this.props.actions.fetchList('/api/v1/topics', {
                tab: tab || 'all',
                limit: limit,
                page: page,
                mdrender: mdrender
            });
            _this.setState(_this.props.state);
        };
        return _this;
    }

    _createClass(Home, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            console.log('homeMount');
            // var scroll = Tool.addEvent(window, 'scroll', this.handleScroll, false);
            var _props$state = this.props.state,
                page = _props$state.page,
                limit = _props$state.limit,
                mdrender = _props$state.mdrender;

            this.props.actions.fetchList('/api/v1/topics', {
                tab: _queryString2.default.parse(this.props.location.search).tab || 'all',
                limit: limit,
                page: page,
                mdrender: mdrender
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var tab = _queryString2.default.parse(this.props.location.search).tab || 'all';
            var state = this.props.state;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_nav2.default, _extends({ tab: tab, changeTab: this.changeTab }, this.props)),
                _react2.default.createElement(_list2.default, { data: state.lists, isFetching: state.isFetching, handleScroll: this.handleScroll })
            );
        }
    }]);

    return Home;
}(_react.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
    return { state: state.fetchList };
}, function (dispatch) {
    return { actions: (0, _redux.bindActionCreators)(_actions2.default, dispatch) };
})(Home);

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

var _components = __webpack_require__(6);

var _tool = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var List = function (_Component) {
    _inherits(List, _Component);

    function List() {
        _classCallCheck(this, List);

        return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).apply(this, arguments));
    }

    _createClass(List, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            console.log('listMount');
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                data = _props.data,
                isFetching = _props.isFetching;

            return _react2.default.createElement(
                'div',
                { className: 'index-list', onScroll: this.props.handleScroll },
                data.map(function (item, index) {
                    return _react2.default.createElement(ListItem, _extends({ key: item.id }, item));
                }),
                _react2.default.createElement(_components.Loading, { loadAnimation: isFetching })
            );
        }
    }]);

    return List;
}(_react.Component);

var ListItem = function (_Component2) {
    _inherits(ListItem, _Component2);

    function ListItem() {
        _classCallCheck(this, ListItem);

        return _possibleConstructorReturn(this, (ListItem.__proto__ || Object.getPrototypeOf(ListItem)).apply(this, arguments));
    }

    _createClass(ListItem, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return nextProps.state != this.props.state;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                id = _props2.id,
                title = _props2.title,
                author = _props2.author,
                visit_count = _props2.visit_count,
                reply_count = _props2.reply_count,
                create_at = _props2.create_at,
                last_reply_at = _props2.last_reply_at;

            return _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                    _reactRouterDom.NavLink,
                    { to: '/topic/' + id },
                    _react2.default.createElement(
                        'div',
                        { 'data-flex': 'box:first' },
                        _react2.default.createElement(
                            'div',
                            { className: 'font', 'data-flex': 'cross:center' },
                            _react2.default.createElement(_components.TabIcon, this.props)
                        ),
                        _react2.default.createElement(
                            'h3',
                            { className: 'tit' },
                            title
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'bottom', 'data-flex': 'box:first' },
                        _react2.default.createElement(
                            'div',
                            { className: 'author', 'data-flex': 'cross:center' },
                            _react2.default.createElement(_components.UserHeadImg, { url: author.avatar_url })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'con', 'data-flex': 'dir:top main:center' },
                            _react2.default.createElement(
                                'p',
                                { 'data-flex': 'cross:center box:last' },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'name' },
                                    author.loginname
                                ),
                                _react2.default.createElement(
                                    'span',
                                    { className: 'count' },
                                    reply_count,
                                    '/',
                                    visit_count
                                )
                            ),
                            _react2.default.createElement(
                                'p',
                                { 'data-flex': 'cross:center box:last' },
                                _react2.default.createElement(
                                    'time',
                                    { className: 'create' },
                                    _tool.Tool.formatDate(create_at)
                                ),
                                _react2.default.createElement(
                                    'time',
                                    { className: 're' },
                                    _tool.Tool.formatDate(last_reply_at)
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return ListItem;
}(_react.Component);

exports.default = List;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

var _queryString = __webpack_require__(10);

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Nav = function (_Component) {
    _inherits(Nav, _Component);

    function Nav(props) {
        _classCallCheck(this, Nav);

        var _this = _possibleConstructorReturn(this, (Nav.__proto__ || Object.getPrototypeOf(Nav)).call(this, props));

        _this.state = {
            isFecthing: false,
            page: 1
        };
        return _this;
    }

    _createClass(Nav, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var tab = this.props.tab;

            var sec = {};
            sec[tab] = 'on';
            return _react2.default.createElement(
                'div',
                { className: 'topNav' },
                _react2.default.createElement(
                    'ul',
                    { 'data-flex': 'box:mean' },
                    _react2.default.createElement(
                        'li',
                        { className: sec.all },
                        _react2.default.createElement(
                            _reactRouterDom.NavLink,
                            { to: '/?tab=all', activeClassName: 'topNavActive', onClick: function onClick() {
                                    _this2.props.changeTab('all');
                                } },
                            '\u5168\u90E8'
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: sec.good },
                        _react2.default.createElement(
                            _reactRouterDom.NavLink,
                            { to: '/?tab=good', activeClassName: 'topNavActive', onClick: function onClick() {
                                    _this2.props.changeTab('good');
                                } },
                            '\u7CBE\u534E'
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: sec.share },
                        _react2.default.createElement(
                            _reactRouterDom.NavLink,
                            { to: '/?tab=share', activeClassName: 'topNavActive', onClick: function onClick() {
                                    _this2.props.changeTab('share');
                                } },
                            '\u5206\u4EAB'
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: sec.ask },
                        _react2.default.createElement(
                            _reactRouterDom.NavLink,
                            { to: '/?tab=ask', activeClassName: 'topNavActive', onClick: function onClick() {
                                    _this2.props.changeTab('ask');
                                } },
                            '\u95EE\u7B54'
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: sec.job },
                        _react2.default.createElement(
                            _reactRouterDom.NavLink,
                            { to: '/?tab=job', activeClassName: 'topNavActive', onClick: function onClick() {
                                    _this2.props.changeTab('job');
                                } },
                            '\u62DB\u8058'
                        )
                    )
                )
            );
        }
    }]);

    return Nav;
}(_react.Component);

exports.default = Nav;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

var _reactRedux = __webpack_require__(7);

var _redux = __webpack_require__(8);

var _home = __webpack_require__(47);

var _home2 = _interopRequireDefault(_home);

var _create = __webpack_require__(46);

var _create2 = _interopRequireDefault(_create);

var _message = __webpack_require__(53);

var _message2 = _interopRequireDefault(_message);

var _user = __webpack_require__(57);

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Root = function (_Component) {
    _inherits(Root, _Component);

    function Root() {
        _classCallCheck(this, Root);

        return _possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).apply(this, arguments));
    }

    _createClass(Root, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                match = _props.match,
                User = _props.User;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'nav', 'data-flex': 'box:mean' },
                    _react2.default.createElement(
                        _reactRouterDom.NavLink,
                        { to: '/', exact: true, activeClassName: 'active' },
                        _react2.default.createElement('i', { className: 'iconfont icon-shouye' }),
                        '\u9996\u9875'
                    ),
                    _react2.default.createElement(
                        _reactRouterDom.NavLink,
                        { to: '/create', activeClassName: 'active' },
                        _react2.default.createElement('i', { className: 'iconfont icon-fabu' }),
                        '\u53D1\u8868'
                    ),
                    _react2.default.createElement(
                        _reactRouterDom.NavLink,
                        { to: '/message', activeClassName: 'active' },
                        _react2.default.createElement('i', { className: 'iconfont icon-xiaoxi' }),
                        '\u6D88\u606F'
                    ),
                    _react2.default.createElement(
                        _reactRouterDom.NavLink,
                        { to: User ? '/user/' + User.loginname : '/login', activeClassName: 'active' },
                        _react2.default.createElement('i', { className: 'iconfont icon-wode' }),
                        '\u6211\u7684'
                    )
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_reactRouterDom.Route, { path: '/', exact: true, component: _home2.default }),
                    _react2.default.createElement(_reactRouterDom.Route, { path: '/create', component: _create2.default }),
                    _react2.default.createElement(_reactRouterDom.Route, { path: '/message', component: _message2.default }),
                    _react2.default.createElement(_reactRouterDom.Route, { path: '/user/:loginname', component: _user2.default })
                )
            );
        }
    }]);

    return Root;
}(_react.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
    return { User: state.User, Home: state.fetchList };
})(Root);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(24);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = __webpack_require__(1);

var _reactRedux = __webpack_require__(7);

var _redux = __webpack_require__(8);

var _actions = __webpack_require__(9);

var _actions2 = _interopRequireDefault(_actions);

var _tool = __webpack_require__(2);

__webpack_require__(72);

var _components = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mine = function (_Component) {
    _inherits(Mine, _Component);

    function Mine(props) {
        _classCallCheck(this, Mine);

        var _this = _possibleConstructorReturn(this, (Mine.__proto__ || Object.getPrototypeOf(Mine)).call(this, props));

        _this.state = {
            button: '登录',
            loginoutBtn: '退出登录'
        };
        _this.signin = function () {
            var accesstoken = _this.refs.accesstoken.value;
            if (!accesstoken) return alert('不能为空！');
            _this.setState({ button: '登录中...' });
            _tool.Tool.post('/api/v1/accesstoken', { accesstoken: accesstoken }, function (res) {
                if (res.success) {
                    alert('登录成功');
                    res.accesstoken = accesstoken;
                    _this.props.actions.loginIn(res);
                    _this.context.router.history.push({
                        pathname: '/user/' + res.loginname
                    });
                } else {
                    alert('登录失败');
                    _this.setState({ button: '登录' });
                }
            }, function () {
                alert('登录失败！');
                _this.setState({ button: '登录' });
            });
        };
        _this.signOut = function () {
            var accesstoken = _this.props.User.accesstoken;
            _this.setState({ loginoutBtn: '退出登录中...' });
            _this.props.actions.loginOut();
            _this.props.history.push('/');
        };
        return _this;
    }

    _createClass(Mine, [{
        key: 'render',
        value: function render() {
            var User = this.props.User;

            var head = null;
            var content = null;
            if (!User) {
                head = _react2.default.createElement(_components.Header, { title: '\u767B\u5F55', leftIcon: 'fanhui', leftClick: this.props.history.goBack });
                content = _react2.default.createElement(
                    'div',
                    { className: 'center' },
                    _react2.default.createElement(
                        'div',
                        { className: 'text' },
                        _react2.default.createElement('input', { ref: 'accesstoken', type: 'text', placeholder: 'Access Token' })
                    ),
                    _react2.default.createElement(
                        'button',
                        { className: 'btn', onClick: this.signin },
                        this.state.button
                    )
                );
            } else {
                head = _react2.default.createElement(_components.Header, { title: '\u9000\u51FA\u767B\u5F55', leftIcon: 'fanhui', leftClick: this.props.history.goBack });
                content = _react2.default.createElement(
                    'div',
                    { className: 'center' },
                    _react2.default.createElement(
                        'div',
                        { className: 'text' },
                        '\u786E\u5B9A\u9000\u51FA\u767B\u5F55\uFF1F'
                    ),
                    _react2.default.createElement(
                        'button',
                        { className: 'loginout btn', onClick: this.signOut },
                        this.state.loginoutBtn
                    )
                );
            }
            return _react2.default.createElement(
                'div',
                null,
                head,
                _react2.default.createElement(
                    'div',
                    { className: 'signin', 'data-flex': 'dir:top main:center cross:center', style: { marginTop: '60px' } },
                    content
                )
            );
        }
    }]);

    return Mine;
}(_react.Component);

Mine.contextTypes = {
    router: _propTypes2.default.object
};

exports.default = (0, _reactRedux.connect)(function (state) {
    return { User: state.User };
}, function (dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)(_actions2.default, dispatch)
    };
})(Mine); //连接redux

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

var _components = __webpack_require__(6);

var _tool = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 消息内容
var Content = function (_Component) {
    _inherits(Content, _Component);

    function Content() {
        _classCallCheck(this, Content);

        return _possibleConstructorReturn(this, (Content.__proto__ || Object.getPrototypeOf(Content)).apply(this, arguments));
    }

    _createClass(Content, [{
        key: 'render',
        value: function render() {
            var list = this.props.list;
            return _react2.default.createElement(
                'div',
                { className: 'msg-box' },
                _react2.default.createElement(
                    'ul',
                    { className: 'list' },
                    list.map(function (item, index) {
                        var type = item.type,
                            author = item.author,
                            topic = item.topic,
                            reply = item.reply,
                            has_read = item.has_read;

                        var content = null;

                        if (type == 'at') {
                            content = _react2.default.createElement(
                                'div',
                                null,
                                '\u5728\u8BDD\u9898',
                                _react2.default.createElement(
                                    _reactRouterDom.NavLink,
                                    { to: '/topic/' + topic.id },
                                    topic.title
                                ),
                                '\u4E2D @\u4E86\u4F60'
                            );
                        } else {
                            content = _react2.default.createElement(
                                'div',
                                null,
                                '\u56DE\u590D\u4F60\u4E86\u7684\u8BDD\u9898',
                                _react2.default.createElement(
                                    _reactRouterDom.NavLink,
                                    { to: '/topic/' + topic.id },
                                    topic.title
                                )
                            );
                        }
                        return _react2.default.createElement(
                            'li',
                            { 'data-flex': 'box:first', key: index },
                            _react2.default.createElement(
                                _reactRouterDom.NavLink,
                                { className: 'user', to: '/user/' + author.loginname },
                                _react2.default.createElement(_components.UserHeadImg, { url: author.avatar_url })
                            ),
                            _react2.default.createElement(
                                'div',
                                null,
                                _react2.default.createElement(
                                    'div',
                                    { className: 'name' },
                                    author.loginname,
                                    _react2.default.createElement(
                                        'time',
                                        null,
                                        _tool.Tool.formatDate(reply.create_at)
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { 'data-flex': 'box:first' },
                                    _react2.default.createElement(
                                        'div',
                                        { 'data-flex': 'cross:center' },
                                        _react2.default.createElement('div', { className: 'dian-' + has_read })
                                    ),
                                    content
                                )
                            )
                        );
                    })
                )
            );
        }
    }]);

    return Content;
}(_react.Component);

exports.default = Content;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

var _reactRedux = __webpack_require__(7);

var _redux = __webpack_require__(8);

var _actions = __webpack_require__(9);

var _actions2 = _interopRequireDefault(_actions);

var _tool = __webpack_require__(2);

var _Content = __webpack_require__(52);

var _Content2 = _interopRequireDefault(_Content);

var _components = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = function (_Component) {
    _inherits(Message, _Component);

    function Message() {
        _classCallCheck(this, Message);

        return _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).apply(this, arguments));
    }

    _createClass(Message, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var url = '/api/v1/messages';
            if (!this.props.User) return false;
            var accesstoken = this.props.User.accesstoken;
            this.props.messageAction.fetchMessage(url, {
                accesstoken: accesstoken,
                mdrender: true
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props$state = this.props.state,
                data = _props$state.data,
                isFetching = _props$state.isFetching,
                id = _props$state.id,
                tabIndex = _props$state.tabIndex;
            var User = this.props.User;

            var main = null;
            if (!User) {
                main = _react2.default.createElement(_components.TipMsgSignin, null);
            } else if (!data) {
                main = _react2.default.createElement(_components.Loading, { loadAnimation: isFetching });
            } else {
                var hasnot_read_messages = data.hasnot_read_messages,
                    has_read_messages = data.has_read_messages;

                Array.prototype.push.apply(hasnot_read_messages, has_read_messages);
                if (hasnot_read_messages.length <= 0) {
                    main = _react2.default.createElement(_components.NoData, null);
                } else {
                    main = _react2.default.createElement(_Content2.default, { list: hasnot_read_messages });
                }
            }
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_components.Header, { title: '\u6D88\u606F' }),
                _react2.default.createElement(
                    'div',
                    { style: { marginTop: '60px' } },
                    main
                )
            );
        }
    }]);

    return Message;
}(_react.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
    return { state: state.fetchMessage, User: state.User };
}, function (dispatch) {
    return { messageAction: (0, _redux.bindActionCreators)(_actions2.default, dispatch) };
})(Message);

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

var _tool = __webpack_require__(2);

var _components = __webpack_require__(6);

var _ReList = __webpack_require__(55);

var _ReList2 = _interopRequireDefault(_ReList);

var _ReplyBox = __webpack_require__(25);

var _ReplyBox2 = _interopRequireDefault(_ReplyBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Article = function (_Component) {
    _inherits(Article, _Component);

    function Article(props) {
        _classCallCheck(this, Article);

        return _possibleConstructorReturn(this, (Article.__proto__ || Object.getPrototypeOf(Article)).call(this, props));
    }

    _createClass(Article, [{
        key: 'render',
        value: function render() {
            var _props$state$data = this.props.state.data,
                id = _props$state$data.id,
                title = _props$state$data.title,
                create_at = _props$state$data.create_at,
                visit_count = _props$state$data.visit_count,
                reply_count = _props$state$data.reply_count,
                content = _props$state$data.content,
                replies = _props$state$data.replies,
                author = _props$state$data.author;

            var createMarkup = function createMarkup() {
                return {
                    __html: content
                };
            };
            var bottom = this.props.User ? _react2.default.createElement(_ReplyBox2.default, { reLoadData: this.props.reLoadData, data: { accesstoken: this.props.User.accesstoken, id: id } }) : _react2.default.createElement(_components.TipMsgSignin, null);
            return _react2.default.createElement(
                'div',
                { className: 'topic' },
                _react2.default.createElement(
                    'div',
                    { className: 'user', 'data-flex': true },
                    _react2.default.createElement(
                        'div',
                        { className: 'headimg', 'data-flex-box': '0' },
                        _react2.default.createElement(_components.UserHeadImg, { url: author.avatar_url })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'data', 'data-flex': 'dir:top', 'data-flex-box': '1' },
                        _react2.default.createElement(
                            'div',
                            { 'data-flex': 'main:justify' },
                            _react2.default.createElement(
                                _reactRouterDom.NavLink,
                                { to: '/user/' + author.loginname, className: 'name' },
                                author.loginname
                            ),
                            _react2.default.createElement(
                                'time',
                                { 'data-flex-box': '1' },
                                _tool.Tool.formatDate(create_at)
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'lou' },
                                '#\u697C\u4E3B'
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'font', 'data-flex': 'main:center cross:center' },
                                _react2.default.createElement(_components.TabIcon, this.props.state.data)
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'qt', 'data-flex': true },
                            _react2.default.createElement(
                                'div',
                                null,
                                '\u9605\u8BFB\uFF1A',
                                visit_count
                            ),
                            _react2.default.createElement(
                                'div',
                                null,
                                '\u56DE\u590D\uFF1A',
                                reply_count
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'h2',
                    { className: 'tit2' },
                    title
                ),
                _react2.default.createElement('div', { className: 'content markdown-body', dangerouslySetInnerHTML: createMarkup() }),
                _react2.default.createElement(
                    'h3',
                    { className: 'tit3' },
                    '\u5171',
                    _react2.default.createElement(
                        'em',
                        null,
                        replies.length
                    ),
                    '\u6761\u56DE\u590D'
                ),
                _react2.default.createElement(_ReList2.default, { reLoadData: this.props.reLoadData, id: id, list: replies, clickZan: this.props.clickZan, showReplyBox: this.props.showReplyBox, User: this.props.User }),
                bottom
            );
        }
    }]);

    return Article;
}(_react.Component);

exports.default = Article;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

var _components = __webpack_require__(6);

var _ReplyBox = __webpack_require__(25);

var _ReplyBox2 = _interopRequireDefault(_ReplyBox);

var _tool = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 回复列表
var ReList = function (_Component) {
    _inherits(ReList, _Component);

    function ReList(props) {
        _classCallCheck(this, ReList);

        // 验证回复项目是否点赞

        var _this = _possibleConstructorReturn(this, (ReList.__proto__ || Object.getPrototypeOf(ReList)).call(this, props));

        _this.isUp = function (arr) {
            var id = _this.props.User ? _this.props.User.id : '';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === id) return true;
            }
            return false;
        };

        return _this;
    }

    _createClass(ReList, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var accesstoken = this.props.User ? this.props.User.accesstoken : '';
            return _react2.default.createElement(
                'ul',
                { className: 're-list' },
                this.props.list.map(function (item, index) {
                    var id = item.id,
                        content = item.content,
                        author = item.author,
                        ups = item.ups,
                        create_at = item.create_at,
                        _item$display = item.display,
                        display = _item$display === undefined ? 'none' : _item$display;

                    var at = new Date(create_at);
                    var upState = _this2.isUp(ups);
                    var createMarkup = function createMarkup() {
                        return {
                            __html: content
                        };
                    };

                    return _react2.default.createElement(
                        'li',
                        { key: index, 'data-flex': true },
                        _react2.default.createElement(
                            'div',
                            { className: 'headimg', 'data-flex-box': '0' },
                            _react2.default.createElement(_components.UserHeadImg, { url: author.avatar_url })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'main', 'data-flex-box': '1' },
                            _react2.default.createElement(
                                'div',
                                { 'data-flex': 'main:justify' },
                                _react2.default.createElement(
                                    _reactRouterDom.NavLink,
                                    { to: '/user/' + author.loginname, className: 'name' },
                                    author.loginname
                                ),
                                _react2.default.createElement(
                                    'time',
                                    { 'data-flex-box': '1' },
                                    _tool.Tool.formatDate(create_at)
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'lou' },
                                    '#',
                                    ++index
                                )
                            ),
                            _react2.default.createElement('div', { className: 'content markdown-body', dangerouslySetInnerHTML: createMarkup() }),
                            _react2.default.createElement(
                                'div',
                                { className: 'bottom', 'data-flex': 'main:right' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'font font-' + upState, onClick: function onClick() {
                                            _this2.props.clickZan(id, index, author.loginname);
                                        } },
                                    _react2.default.createElement('i', { className: 'iconfont icon-dianzan ' }),
                                    _react2.default.createElement(
                                        'em',
                                        null,
                                        ups.length ? ups.length : ''
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'font', onClick: function onClick() {
                                            _this2.props.showReplyBox(index);
                                        } },
                                    _react2.default.createElement('i', { className: 'iconfont icon-huifu' })
                                )
                            ),
                            _react2.default.createElement(_ReplyBox2.default, { placeholder: '@' + author.loginname, reLoadData: _this2.props.reLoadData, display: display, loginname: author.loginname, data: { accesstoken: accesstoken, id: _this2.props.id, reply_id: id } })
                        )
                    );
                })
            );
        }
    }]);

    return ReList;
}(_react.Component);

exports.default = ReList;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(32);

var _reactRedux = __webpack_require__(7);

var _redux = __webpack_require__(8);

var _components = __webpack_require__(6);

var _Article = __webpack_require__(54);

var _Article2 = _interopRequireDefault(_Article);

var _actions = __webpack_require__(9);

var _actions2 = _interopRequireDefault(_actions);

var _tool = __webpack_require__(2);

__webpack_require__(73);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Topic = function (_Component) {
    _inherits(Topic, _Component);

    function Topic(props) {
        _classCallCheck(this, Topic);

        //点赞或取消赞
        var _this = _possibleConstructorReturn(this, (Topic.__proto__ || Object.getPrototypeOf(Topic)).call(this, props));

        _this.clickZan = function (id, index, loginname) {
            var accesstoken = _this.props.User ? _this.props.User.accesstoken : '';
            var uid = _this.props.User ? _this.props.User.id : '';
            if (!accesstoken) {
                return _this.props.history.push({ pathname: '/login' }); //跳转到登录
            } else if (_this.props.User.loginname === loginname) {
                return alert('你不能给自己点赞');
            }
            _tool.Tool.post('/api/v1/reply/' + id + '/ups', { accesstoken: accesstoken }, function (res) {
                var ups = _this.props.state.data.replies[index - 1].ups;
                if (res.action == 'down') {
                    //取消点赞
                    for (var i = 0; i < ups.length; i++) {
                        if (ups[i] === uid) {
                            ups.splice(i, 1);
                        };
                    }
                } else {
                    ups.push(uid);
                }
                _this.setState(_this.props.state);
            });
        };

        // 显示回复框
        _this.showReplyBox = function (index) {
            var accesstoken = _this.props.User ? _this.props.User.accesstoken : '';
            if (!accesstoken) {
                return _this.props.history.push({ pathname: '/signin' }); //跳转到登录
            }
            --index;
            if (_this.props.state.data.replies[index].display === 'block') {
                _this.props.state.data.replies[index].display = 'none';
            } else {
                _this.props.state.data.replies[index].display = 'block';
            }

            _this.setState(_this.props.state);
        };
        // 回复成功后，重新加载数据
        _this.reLoadData = function (data) {
            _this.props.state.data = data;
            _this.setState(_this.props.state);
        };
        return _this;
    }

    _createClass(Topic, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var url = '/api/v1/' + this.props.location.pathname;
            this.props.actions.fetchTopic(url, {
                mdrender: true
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props$state = this.props.state,
                data = _props$state.data,
                isFetching = _props$state.isFetching,
                id = _props$state.id;

            console.log(this.props.state);
            var main = data ? _react2.default.createElement(_Article2.default, _extends({}, this.props, { reLoadData: this.reLoadData, clickZan: this.clickZan, showReplyBox: this.showReplyBox })) : _react2.default.createElement(_components.Loading, { loadAnimation: isFetching });
            var headerSet = {
                leftIcon: 'fanhui',
                leftClick: this.props.history.goBack
            };
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_components.Header, _extends({}, this.props, headerSet, { title: '\u8BE6\u60C5' })),
                _react2.default.createElement(
                    'div',
                    { style: { marginTop: "60px" } },
                    main
                )
            );
        }
    }]);

    return Topic;
}(_react.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
    return { state: state.fetchTopic, User: state.User };
}, function (dispatch) {
    return { actions: (0, _redux.bindActionCreators)(_actions2.default, dispatch) };
})(Topic);

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

var _reactRedux = __webpack_require__(7);

var _redux = __webpack_require__(8);

var _queryString = __webpack_require__(10);

var _queryString2 = _interopRequireDefault(_queryString);

var _components = __webpack_require__(6);

var _actions = __webpack_require__(9);

var _actions2 = _interopRequireDefault(_actions);

var _tool = __webpack_require__(2);

__webpack_require__(74);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserView = function (_Component) {
    _inherits(UserView, _Component);

    function UserView(props) {
        _classCallCheck(this, UserView);

        var _this = _possibleConstructorReturn(this, (UserView.__proto__ || Object.getPrototypeOf(UserView)).call(this, props));

        _this.state = {
            tabIndex: 0
        };
        _this.tab = function (tabIndex) {
            _this.setState({
                tabIndex: tabIndex
            });
        };
        _this.signOut = function () {
            _this.props.history.push();
        };
        var username = _this.props.location.pathname.split('/')[_this.props.location.pathname.split('/').length - 1];
        var url = '/api/v1/user/' + username;

        _this.props.actions.fetchDetail(url, {});
        return _this;
    }

    _createClass(UserView, [{
        key: 'render',
        value: function render() {
            console.log(this.props);
            var _props$state = this.props.state,
                data = _props$state.data,
                isFetching = _props$state.isFetching,
                tabIndex = _props$state.tabIndex;
            var _props = this.props,
                User = _props.User,
                match = _props.match;

            var params = match.params;
            User = User || {};
            var main = data ? _react2.default.createElement(Home, _defineProperty({ data: data, tabIndex: tabIndex, tab: this.tab }, 'tabIndex', this.state.tabIndex)) : _react2.default.createElement(_components.Loading, { loadAnimation: isFetching });
            var title = params.loginname === User.loginname ? '个人中心' : params.loginname + '的个人中心';
            var leftIcon = params.loginname === User.loginname ? null : 'fanhui';
            var rightIcon = params.loginname === User.loginname ? 'tuichu' : null;
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_components.Header, { title: title, leftIcon: leftIcon, rightIcon: rightIcon, rightTo: '/login' }),
                _react2.default.createElement(
                    'div',
                    { style: { marginTop: '60px' } },
                    main
                )
            );
        }
    }]);

    return UserView;
}(_react.Component);

//  个人主页


var Home = function (_Component2) {
    _inherits(Home, _Component2);

    function Home() {
        _classCallCheck(this, Home);

        return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).apply(this, arguments));
    }

    _createClass(Home, [{
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props$data = this.props.data,
                avatar_url = _props$data.avatar_url,
                loginname = _props$data.loginname,
                score = _props$data.score,
                recent_topics = _props$data.recent_topics,
                recent_replies = _props$data.recent_replies,
                create_at = _props$data.create_at;
            var tabIndex = this.props.tabIndex;

            var arrOn = [];
            var arrDisplay = [];
            arrOn[tabIndex] = 'on';
            arrDisplay[tabIndex] = 'block';
            return _react2.default.createElement(
                'div',
                { className: 'user-index' },
                _react2.default.createElement(
                    'div',
                    { className: 'headimg', 'data-flex': 'dir:top main:center cross:center' },
                    _react2.default.createElement(_components.UserHeadImg, { url: avatar_url }),
                    _react2.default.createElement(
                        'div',
                        { className: 'name' },
                        loginname
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'score' },
                        '\u79EF\u5206\uFF1A',
                        score,
                        '\xA0\xA0\xA0\xA0\xA0\xA0\u6CE8\u518C\u4E8E\uFF1A',
                        _tool.Tool.formatDate(create_at)
                    )
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'tab-nav', 'data-flex': 'box:mean' },
                    _react2.default.createElement(
                        'li',
                        { onClick: function onClick() {
                                _this3.props.tab(0);
                            }, className: arrOn[0] },
                        '\u4E3B\u9898'
                    ),
                    _react2.default.createElement(
                        'li',
                        { onClick: function onClick() {
                                _this3.props.tab(1);
                            }, className: arrOn[1] },
                        '\u56DE\u590D'
                    )
                ),
                _react2.default.createElement(HomeList, { list: recent_topics, display: arrDisplay[0] }),
                _react2.default.createElement(HomeList, { list: recent_replies, display: arrDisplay[1] })
            );
        }
    }]);

    return Home;
}(_react.Component);

// 发布的主题和回复的主题列表


var HomeList = function (_Component3) {
    _inherits(HomeList, _Component3);

    function HomeList() {
        _classCallCheck(this, HomeList);

        return _possibleConstructorReturn(this, (HomeList.__proto__ || Object.getPrototypeOf(HomeList)).apply(this, arguments));
    }

    _createClass(HomeList, [{
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                list = _props2.list,
                display = _props2.display;

            return _react2.default.createElement(
                'ul',
                { className: 'list', style: { display: display } },
                list.map(function (item, index) {
                    var id = item.id,
                        title = item.title,
                        last_reply_at = item.last_reply_at;

                    return _react2.default.createElement(
                        'li',
                        { key: index },
                        _react2.default.createElement(
                            _reactRouterDom.NavLink,
                            { 'data-flex': 'box:last', to: '/topic/' + id },
                            _react2.default.createElement(
                                'div',
                                { className: 'tit' },
                                title
                            ),
                            _react2.default.createElement(
                                'time',
                                { className: true },
                                _tool.Tool.formatDate(last_reply_at)
                            )
                        )
                    );
                })
            );
        }
    }]);

    return HomeList;
}(_react.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
    return { User: state.User, state: state.fetchDetail };
}, function (dispatch) {
    return { actions: (0, _redux.bindActionCreators)(_actions2.default, dispatch) };
})(UserView);

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tool = __webpack_require__(2);

//首页
function fetchList() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { isFetching: false, lists: [], page: 1, nextBtn: true, limit: 10, mdrender: false, tab: 'all' };
  var action = arguments[1];

  var newState = void 0,
      lists = void 0,
      page = void 0,
      tab = void 0;
  switch (action.type) {
    case 'BEGIN_FETCH_LIST':
      if (state.isFetching) return state;
      if (state.tab !== action.tab) {
        lists = [];
        tab = action.tab;
      } else {
        lists = state.lists;
      }
      newState = Object.assign({}, state, {
        isFetching: true,
        lists: lists,
        tab: tab || state.tab
      });
      return newState;
    case 'FAIL_FETCH_LIST':
      newState = Object.assign({}, state, {
        isFetching: false
      });
      return newState;
    case 'DONE_FETCH_LIST':
      if (state.tab !== action.tab) {
        lists = action.payload;
        page = 2;
        tab = action.tab;
      } else {
        lists = state.lists.concat(action.payload);
        page = state.page + 1;
      }
      newState = Object.assign({}, state, {
        isFetching: false,
        lists: lists,
        page: page,
        tab: tab || state.tab
      });
      return newState;
    default:
      return state;
  }
}
//详情
function fetchTopic() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { isFetching: false, data: null };
  var action = arguments[1];

  var newState = void 0;
  switch (action.type) {
    case 'BEGIN_FETCH_TOPIC':
      newState = Object.assign({}, state, {
        isFetching: true
      });
      return newState;
    case 'DONE_FETCH_TOPIC':
      newState = Object.assign({}, state, {
        isFetching: false,
        data: action.payload
      });
      return newState;
    default:
      return state;
  }
}
//发表
function createTopic() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { isFetching: false, data: null };
  var action = arguments[1];

  var newState = void 0;
  switch (action.type) {
    case 'BEGIN_CREATE_TOPIC':
      newState = Object.assign({}, state, {
        isFetching: true
      });
      return newState;
    case 'DONE_CREATE_TOPIC':
      newState = Object.assign({}, state, {
        isFetching: false,
        data: action.payload
      });
      return newState;
    default:
      return state;
  }
}

//消息
function fetchMessage() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { isFetching: false, data: null };
  var action = arguments[1];

  var newState = void 0;
  switch (action.type) {
    case 'BEGIN_FETCH_MESSAGE':
      newState = Object.assign({}, state, {
        isFetching: true
      });
      return newState;
    case 'DONE_FETCH_MESSAGE':
      newState = Object.assign({}, state, {
        isFetching: false,
        data: action.payload
      });
      return newState;
    default:
      return state;
  }
}

//登录
// console.log(Tool.getOrSetItem('user'));
function login() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tool.Tool.getOrSetItem('user');
  var action = arguments[1];

  var newState = void 0;
  switch (action.type) {
    case 'LOGIN_IN_SUCCESS':
      _tool.Tool.getOrSetItem('user', action.payload);
      newState = action.payload;
      return newState;
    case 'LOGIN_OUT':
      _tool.Tool.removeItem('user');
      return null;
    default:
      return state;
  }
}

//个人中心
function fetchDetail() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { isFetching: false, data: null };
  var action = arguments[1];

  var newState = void 0;
  switch (action.type) {
    case 'BEGIN_FETCH_DETAIL':
      newState = Object.assign({}, state, {
        isFetching: true
      });
      return newState;
    case 'DONE_FETCH_DETAIL':
      newState = Object.assign({}, state, {
        isFetching: false,
        data: action.payload
      });
      return newState;
    default:
      return state;
  }
}

exports.default = {
  fetchList: fetchList,
  fetchTopic: fetchTopic,
  createTopic: createTopic,
  fetchMessage: fetchMessage,
  User: login,
  fetchDetail: fetchDetail
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

var _createBrowserHistory = __webpack_require__(29);

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createHashHistory = __webpack_require__(30);

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _pages = __webpack_require__(50);

var _pages2 = _interopRequireDefault(_pages);

var _topic = __webpack_require__(56);

var _topic2 = _interopRequireDefault(_topic);

var _login = __webpack_require__(51);

var _login2 = _interopRequireDefault(_login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var history = (0, _createHashHistory2.default)();

function Routes() {
    return _react2.default.createElement(
        _reactRouterDom.Router,
        { history: history },
        _react2.default.createElement(
            _reactRouterDom.Switch,
            null,
            _react2.default.createElement(_reactRouterDom.Route, { path: '/login', component: _login2.default }),
            _react2.default.createElement(_reactRouterDom.Route, { path: '/topic/:id?', component: _topic2.default }),
            _react2.default.createElement(_reactRouterDom.Route, { path: '/', component: _pages2.default }),
            _react2.default.createElement(_reactRouterDom.Redirect, { from: '', to: '/' })
        )
    );
}

exports.default = Routes;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = __webpack_require__(8);

var _reducer = __webpack_require__(58);

var _reducer2 = _interopRequireDefault(_reducer);

var _reduxThunk = __webpack_require__(35);

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _redux.createStore)((0, _redux.combineReducers)(_reducer2.default), (0, _redux.applyMiddleware)(_reduxThunk2.default));

exports.default = store;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "iconfont.svg";

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "iconfont.ttf";

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "iconfont.woff";

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(13, function() {
			var newContent = __webpack_require__(13);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(14, function() {
			var newContent = __webpack_require__(14);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(21, function() {
			var newContent = __webpack_require__(21);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(22, function() {
			var newContent = __webpack_require__(22);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(11, function() {
			var newContent = __webpack_require__(11);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(12, function() {
			var newContent = __webpack_require__(12);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(15, function() {
			var newContent = __webpack_require__(15);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(16, function() {
			var newContent = __webpack_require__(16);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(17, function() {
			var newContent = __webpack_require__(17);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(18, function() {
			var newContent = __webpack_require__(18);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(19);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(19, function() {
			var newContent = __webpack_require__(19);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(20, function() {
			var newContent = __webpack_require__(20);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(28);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDMwNjdmMDQ3NzlmMjU0NGExOWQiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC9yZWFjdC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyLWRvbS9lcy9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy8uL3NyYy90b29sL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsaWJcIiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWR1eC9lcy9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vcXVlcnktc3RyaW5nL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0hlYWRlci9pbmRleC5sZXNzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0xvYWRpbmcvaW5kZXgubGVzcyIsIndlYnBhY2s6Ly8vLi9+L2ZsZXguY3NzL2Rpc3QvZGF0YS1mbGV4LmNzcyIsIndlYnBhY2s6Ly8vLi9+L2dpdGh1Yi1tYXJrZG93bi1jc3MvZ2l0aHViLW1hcmtkb3duLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvY3JlYXRlL2luZGV4Lmxlc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2hvbWUvaW5kZXgubGVzcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9naW4vaW5kZXgubGVzcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvdG9waWMvaW5kZXgubGVzcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvdXNlci9pbmRleC5sZXNzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZS9zdHlsZS5sZXNzIiwid2VicGFjazovLy8uL34vbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzIiwid2VicGFjazovLy8uL3NyYy9pY29uZm9udC9pY29uZm9udC5jc3MiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC1kb20vaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvdG9waWMvUmVwbHlCb3guanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ljb25mb250L2ljb25mb250LmVvdCIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vYW1kLW9wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvaGlzdG9yeS9jcmVhdGVCcm93c2VySGlzdG9yeS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvaGlzdG9yeS9jcmVhdGVIYXNoSGlzdG9yeS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2VzL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vLy4vfi9pc29tb3JwaGljLWZldGNoL2ZldGNoLW5wbS1icm93c2VyaWZ5LmpzIiwid2VicGFjazovLy8uL34vb2JqLW1lcmdlZC9kaXN0L29iai1tZXJnZWQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC10aHVuay9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdHJpY3QtdXJpLWVuY29kZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9saWIvdXJscy5qcyIsIndlYnBhY2s6Ly8vLi9+L3doYXR3Zy1mZXRjaC9mZXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9IZWFkZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvTG9hZGluZy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9Ob0RhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvVGFiSWNvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9UaXBNc2dTaWduSW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvVXNlckhlYWRJbWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2NyZWF0ZS9OZXdUb3BpYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvY3JlYXRlL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9ob21lL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9ob21lL2xpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2hvbWUvbmF2LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9naW4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL21lc3NhZ2UvQ29udGVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbWVzc2FnZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvdG9waWMvQXJ0aWNsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvdG9waWMvUmVMaXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy90b3BpYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvdXNlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVkdWNlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcm91dGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0b3JlL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9pY29uZm9udC9pY29uZm9udC5zdmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ljb25mb250L2ljb25mb250LnR0ZiIsIndlYnBhY2s6Ly8vLi9zcmMvaWNvbmZvbnQvaWNvbmZvbnQud29mZiIsIndlYnBhY2s6Ly8vLi9+L2ZsZXguY3NzL2Rpc3QvZGF0YS1mbGV4LmNzcz9lN2YwIiwid2VicGFjazovLy8uL34vZ2l0aHViLW1hcmtkb3duLWNzcy9naXRodWItbWFya2Rvd24uY3NzP2E4ZTQiLCJ3ZWJwYWNrOi8vLy4vfi9ub3JtYWxpemUuY3NzL25vcm1hbGl6ZS5jc3M/MjU3MyIsIndlYnBhY2s6Ly8vLi9zcmMvaWNvbmZvbnQvaWNvbmZvbnQuY3NzPzlkYTAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvSGVhZGVyL2luZGV4Lmxlc3M/YTg0OCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9Mb2FkaW5nL2luZGV4Lmxlc3M/MjkzOSIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvY3JlYXRlL2luZGV4Lmxlc3M/ZWQ0ZSIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvaG9tZS9pbmRleC5sZXNzPzY4NmEiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2xvZ2luL2luZGV4Lmxlc3M/MGFjMiIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvdG9waWMvaW5kZXgubGVzcz80NTBjIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy91c2VyL2luZGV4Lmxlc3M/ZmY1MiIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUvc3R5bGUubGVzcz83ODI1Il0sIm5hbWVzIjpbInRhcmdldCIsIlRvb2wiLCJhamF4IiwibXlTZXR0aW5nIiwic2V0dGluZyIsInVybCIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJhc3luYyIsInR5cGUiLCJkYXRhIiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwidGV4dCIsImVycm9yIiwiYURhdGEiLCJzRGF0YSIsImF0dHIiLCJwdXNoIiwiZmlsdGVyIiwiam9pbiIsInRvVXBwZXJDYXNlIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwiRGF0ZSIsImdldFRpbWUiLCJzZW5kIiwic2V0UmVxdWVzdEhlYWRlciIsImUiLCJodHRwRW5kIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlYWR5U3RhdGUiLCJoZWFkIiwiZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIiwicmVzcG9uc2UiLCJyZXNwb25zZVRleHQiLCJ0ZXN0IiwiSlNPTiIsInBhcnNlIiwic3RhdHVzIiwiZW5kIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInN0ciIsInJlcGxhY2UiLCJwb3N0IiwiZ2V0IiwiZm9ybWF0RGF0ZSIsImRhdGUiLCJ0aW1lIiwicGFyc2VJbnQiLCJsb2NhbEl0ZW0iLCJrZXkiLCJ2YWx1ZSIsImFyZ3VtZW50cyIsImxlbmd0aCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRJdGVtIiwicmVtb3ZlTG9jYWxJdGVtIiwicmVtb3ZlSXRlbSIsInNldFVybFBhcmFtcyIsIm9yaWdpbiIsInBhcmFtcyIsInJlc3VsdCIsImkiLCJnZXRPclNldEl0ZW0iLCJzdHJpbmdpZnkiLCJhZGRFdmVudCIsImVsIiwiZXZlbnQiLCJmbiIsImNvbnNvbGUiLCJsb2ciLCJhdHRhY2hFdmVudCIsIm1lcmdlZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ1c2VTb3VyY2VNYXAiLCJsaXN0IiwidG9TdHJpbmciLCJtYXAiLCJpdGVtIiwiY29udGVudCIsImNzc1dpdGhNYXBwaW5nVG9TdHJpbmciLCJtb2R1bGVzIiwibWVkaWFRdWVyeSIsImFscmVhZHlJbXBvcnRlZE1vZHVsZXMiLCJpZCIsImNzc01hcHBpbmciLCJidG9hIiwic291cmNlTWFwcGluZyIsInRvQ29tbWVudCIsInNvdXJjZVVSTHMiLCJzb3VyY2VzIiwic291cmNlIiwic291cmNlUm9vdCIsImNvbmNhdCIsInNvdXJjZU1hcCIsImJhc2U2NCIsInVuZXNjYXBlIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiVGFiSWNvbiIsIlVzZXJIZWFkSW1nIiwiTG9hZGluZyIsIlRpcE1zZ1NpZ25pbiIsIkhlYWRlciIsIk5vRGF0YSIsImFjdGlvbnMiLCJmZXRjaExpc3QiLCJvcHRpb25zIiwiZGlzcGF0Y2giLCJnZXRTdGF0ZSIsImJlZ2luRmV0Y2hMaXN0IiwidGFiIiwiYWRkcmVzcyIsInRoZW4iLCJyZXMiLCJmYWlsRmV0Y2hMaXN0Iiwic3RhdHVzVGV4dCIsIm9rIiwianNvbiIsImRvbmVGZXRjaExpc3QiLCJjYXRjaCIsInBheWxvYWQiLCJFcnJvciIsImVyck1zZyIsImZldGNoVG9waWMiLCJiZWdpbmZldGNoVG9waWMiLCJzdGF0ZSIsImZhaWxmZXRjaFRvcGljIiwiZG9uZWZldGNoVG9waWMiLCJjcmVhdGVUb3BpYyIsImJlZ2luQ3JlYXRlVG9waWMiLCJmYWlsQ3JlYXRlVG9waWMiLCJkb25lQ3JlYXRlVG9waWMiLCJmZXRjaE1lc3NhZ2UiLCJiZWdpbkZldGNoTWVzc2FnZSIsImZhaWxGZXRjaE1lc3NhZ2UiLCJkb25lRmV0Y2hNZXNzYWdlIiwibG9naW5JbiIsImxvZ2luT3V0IiwiZmV0Y2hEZXRhaWwiLCJiZWdpbkZldGNoRGV0YWlsIiwiZmFpbEZldGNoRGV0YWlsIiwiZG9uZUZldGNoRGV0YWlsIiwic3RyaWN0VXJpRW5jb2RlIiwicmVxdWlyZSIsIm9iamVjdEFzc2lnbiIsImVuY29kZXJGb3JBcnJheUZvcm1hdCIsIm9wdHMiLCJhcnJheUZvcm1hdCIsImluZGV4IiwiZW5jb2RlIiwicGFyc2VyRm9yQXJyYXlGb3JtYXQiLCJhY2N1bXVsYXRvciIsImV4ZWMiLCJ1bmRlZmluZWQiLCJzdHJpY3QiLCJrZXlzU29ydGVyIiwiaW5wdXQiLCJBcnJheSIsImlzQXJyYXkiLCJzb3J0IiwiT2JqZWN0Iiwia2V5cyIsImEiLCJiIiwiTnVtYmVyIiwiZXh0cmFjdCIsInNwbGl0IiwiZm9ybWF0dGVyIiwicmV0IiwiY3JlYXRlIiwidHJpbSIsImZvckVhY2giLCJwYXJhbSIsInBhcnRzIiwic2hpZnQiLCJ2YWwiLCJkZWNvZGVVUklDb21wb25lbnQiLCJyZWR1Y2UiLCJCb29sZWFuIiwib2JqIiwiZGVmYXVsdHMiLCJzbGljZSIsInZhbDIiLCJ4IiwiUmVwbHlCb3giLCJwcm9wcyIsImJ0bm5hbWUiLCJzdWJtaXQiLCJyZXBseV9pZCIsImxvZ2lubmFtZSIsInJlZnMiLCJhbGVydCIsInNldFN0YXRlIiwicmVMb2FkRGF0YSIsImRpc3BsYXkiLCJwbGFjZWhvbGRlciIsImRlZmF1bHRQcm9wcyIsIkFwcCIsInJlbmRlciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzZWxmIiwiZmV0Y2giLCJiaW5kIiwiZGVmaW5lIiwibGVuIiwiYXJnIiwiY3VyT2JqIiwiaXNKc29uIiwibWVyZ2VkQXJyIiwiYXJyIiwiYXJyMiIsInByb3RvdHlwZSIsImNhbGwiLCJ0b0xvd2VyQ2FzZSIsIl9fZXNNb2R1bGUiLCJjcmVhdGVUaHVua01pZGRsZXdhcmUiLCJleHRyYUFyZ3VtZW50IiwiX3JlZiIsIm5leHQiLCJhY3Rpb24iLCJ0aHVuayIsIndpdGhFeHRyYUFyZ3VtZW50IiwiYyIsImNoYXJDb2RlQXQiLCJjc3MiLCJiYXNlVXJsIiwicHJvdG9jb2wiLCJob3N0IiwiY3VycmVudERpciIsImZpeGVkQ3NzIiwiZnVsbE1hdGNoIiwib3JpZ1VybCIsInVucXVvdGVkT3JpZ1VybCIsIm8iLCIkMSIsIm5ld1VybCIsImluZGV4T2YiLCJzdXBwb3J0Iiwic2VhcmNoUGFyYW1zIiwiaXRlcmFibGUiLCJTeW1ib2wiLCJibG9iIiwiQmxvYiIsImZvcm1EYXRhIiwiYXJyYXlCdWZmZXIiLCJ2aWV3Q2xhc3NlcyIsImlzRGF0YVZpZXciLCJEYXRhVmlldyIsImlzUHJvdG90eXBlT2YiLCJpc0FycmF5QnVmZmVyVmlldyIsIkFycmF5QnVmZmVyIiwiaXNWaWV3Iiwibm9ybWFsaXplTmFtZSIsIm5hbWUiLCJTdHJpbmciLCJUeXBlRXJyb3IiLCJub3JtYWxpemVWYWx1ZSIsIml0ZXJhdG9yRm9yIiwiaXRlbXMiLCJpdGVyYXRvciIsImRvbmUiLCJIZWFkZXJzIiwiaGVhZGVycyIsImFwcGVuZCIsImhlYWRlciIsImdldE93blByb3BlcnR5TmFtZXMiLCJvbGRWYWx1ZSIsImhhcyIsImhhc093blByb3BlcnR5Iiwic2V0IiwiY2FsbGJhY2siLCJ0aGlzQXJnIiwidmFsdWVzIiwiZW50cmllcyIsImNvbnN1bWVkIiwiYm9keSIsImJvZHlVc2VkIiwiUHJvbWlzZSIsInJlamVjdCIsImZpbGVSZWFkZXJSZWFkeSIsInJlYWRlciIsInJlc29sdmUiLCJvbmxvYWQiLCJvbmVycm9yIiwicmVhZEJsb2JBc0FycmF5QnVmZmVyIiwiRmlsZVJlYWRlciIsInByb21pc2UiLCJyZWFkQXNBcnJheUJ1ZmZlciIsInJlYWRCbG9iQXNUZXh0IiwicmVhZEFzVGV4dCIsInJlYWRBcnJheUJ1ZmZlckFzVGV4dCIsImJ1ZiIsInZpZXciLCJVaW50OEFycmF5IiwiY2hhcnMiLCJmcm9tQ2hhckNvZGUiLCJidWZmZXJDbG9uZSIsImJ5dGVMZW5ndGgiLCJidWZmZXIiLCJCb2R5IiwiX2luaXRCb2R5IiwiX2JvZHlJbml0IiwiX2JvZHlUZXh0IiwiX2JvZHlCbG9iIiwiRm9ybURhdGEiLCJfYm9keUZvcm1EYXRhIiwiVVJMU2VhcmNoUGFyYW1zIiwiX2JvZHlBcnJheUJ1ZmZlciIsInJlamVjdGVkIiwiZGVjb2RlIiwibWV0aG9kcyIsIm5vcm1hbGl6ZU1ldGhvZCIsIm1ldGhvZCIsInVwY2FzZWQiLCJSZXF1ZXN0IiwiY3JlZGVudGlhbHMiLCJtb2RlIiwicmVmZXJyZXIiLCJjbG9uZSIsImZvcm0iLCJieXRlcyIsInBhcnNlSGVhZGVycyIsInJhd0hlYWRlcnMiLCJsaW5lIiwiUmVzcG9uc2UiLCJib2R5SW5pdCIsInJlZGlyZWN0U3RhdHVzZXMiLCJyZWRpcmVjdCIsIlJhbmdlRXJyb3IiLCJpbml0IiwicmVxdWVzdCIsInJlc3BvbnNlVVJMIiwib250aW1lb3V0Iiwid2l0aENyZWRlbnRpYWxzIiwicmVzcG9uc2VUeXBlIiwicG9seWZpbGwiLCJsZWZ0SWNvbiIsImxlZnRDbGljayIsInJpZ2h0VG8iLCJyaWdodEljb24iLCJyaWdodENsaWNrIiwidGl0bGUiLCJsZWZ0IiwicmlnaHQiLCJsb2FkQW5pbWF0aW9uIiwibG9hZE1zZyIsIkNvbXBvbmVudCIsIm1hcmdpblRvcCIsInRleHRBbGlnbiIsImNvbG9yIiwicGFkZGluZyIsInRvcCIsImdvb2QiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJOZXdUb3BpYyIsInRhYklucHV0IiwidGl0bGVJbnB1dCIsImNvbnRlbnRJbnB1dCIsIkNyZWF0ZSIsImFjY2Vzc3Rva2VuIiwiVXNlciIsInBvc3RTdGF0ZSIsImNvbnRleHQiLCJyb3V0ZXIiLCJoaXN0b3J5IiwidG9waWNfaWQiLCJoZWFkZXJTZXQiLCJtYWluIiwiY29udGV4dFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImNyZWF0ZUFjdGlvbiIsIkhvbWUiLCJoYW5kbGVTY3JvbGwiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJjb250YWluZXJIZWlnaHQiLCJpbm5lckhlaWdodCIsInBhZ2UiLCJsaW1pdCIsIm1kcmVuZGVyIiwiaXNGZXRjaGluZyIsInNlYXJjaCIsImNoYW5nZVRhYiIsImxpc3RzIiwiTGlzdCIsIkxpc3RJdGVtIiwibmV4dFByb3BzIiwiYXV0aG9yIiwidmlzaXRfY291bnQiLCJyZXBseV9jb3VudCIsImNyZWF0ZV9hdCIsImxhc3RfcmVwbHlfYXQiLCJhdmF0YXJfdXJsIiwiTmF2IiwiaXNGZWN0aGluZyIsInNlYyIsImFsbCIsInNoYXJlIiwiYXNrIiwiam9iIiwiUm9vdCIsIm1hdGNoIiwiTWluZSIsImJ1dHRvbiIsImxvZ2lub3V0QnRuIiwic2lnbmluIiwic2lnbk91dCIsImdvQmFjayIsIkNvbnRlbnQiLCJ0b3BpYyIsInJlcGx5IiwiaGFzX3JlYWQiLCJNZXNzYWdlIiwibWVzc2FnZUFjdGlvbiIsInRhYkluZGV4IiwiaGFzbm90X3JlYWRfbWVzc2FnZXMiLCJoYXNfcmVhZF9tZXNzYWdlcyIsImFwcGx5IiwiQXJ0aWNsZSIsInJlcGxpZXMiLCJjcmVhdGVNYXJrdXAiLCJfX2h0bWwiLCJib3R0b20iLCJjbGlja1phbiIsInNob3dSZXBseUJveCIsIlJlTGlzdCIsImlzVXAiLCJ1cHMiLCJhdCIsInVwU3RhdGUiLCJUb3BpYyIsInVpZCIsInNwbGljZSIsIlVzZXJWaWV3IiwidXNlcm5hbWUiLCJzY29yZSIsInJlY2VudF90b3BpY3MiLCJyZWNlbnRfcmVwbGllcyIsImFyck9uIiwiYXJyRGlzcGxheSIsIkhvbWVMaXN0IiwibmV4dEJ0biIsIm5ld1N0YXRlIiwiYXNzaWduIiwibG9naW4iLCJSb3V0ZXMiLCJzdG9yZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBMkQ7QUFDM0Q7QUFDQTtBQUNBLFdBQUc7O0FBRUgsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDBDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBLG9DQUE0QjtBQUM1QixxQ0FBNkI7QUFDN0IseUNBQWlDOztBQUVqQywrQ0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOENBQXNDO0FBQ3RDO0FBQ0E7QUFDQSxxQ0FBNkI7QUFDN0IscUNBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUFpQiw4QkFBOEI7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBLDREQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBLGFBQUs7QUFDTCxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBYyw0QkFBNEI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLHVDQUF1QztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkLGtEQUFrRCxzQkFBc0I7QUFDeEU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7OztBQ3pCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7OztBQ3pCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7OztBQ3pCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7OztBQ3pCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7OztBQ3pCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7OztBQ3pCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7OztBQ3pCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0dGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSBcclxuIFx0ZnVuY3Rpb24gd2VicGFja0hvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdFx0aWYocGFyZW50SG90VXBkYXRlQ2FsbGJhY2spIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0fSA7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG4gXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gXHRcdHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuIFx0XHRzY3JpcHQuY2hhcnNldCA9IFwidXRmLThcIjtcclxuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdCgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IDEwMDAwO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCJkMzA2N2YwNDc3OWYyNTQ0YTE5ZFwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHRob3RBcHBseShob3RBcHBseU9uVXBkYXRlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHR9LCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9kaXN0XCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoNzYpKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDc2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkMzA2N2YwNDc3OWYyNTQ0YTE5ZCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oNSkpKDcpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC9yZWFjdC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oNSkpKDExMCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci1kb20vZXMvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgbWVyZ2VkIGZyb20gJ29iai1tZXJnZWQnO1xyXG5cclxuY29uc3QgdGFyZ2V0ID0gJ2h0dHBzOi8vY25vZGVqcy5vcmcnO1xyXG5jb25zdCBUb29sID0ge307XHJcblxyXG4vL+WPkemAgWFqYXjor7fmsYLlkozmnI3liqHlmajkuqTkupJcclxuVG9vbC5hamF4ID0gZnVuY3Rpb24gKG15U2V0dGluZykge1xyXG5cclxuICAgIHZhciBzZXR0aW5nID0ge1xyXG4gICAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCAvL+m7mOiupGFqYXjor7fmsYLlnLDlnYBcclxuICAgICAgICBhc3luYzogdHJ1ZSwgLy90cnVl44CC6buY6K6k6K6+572u5LiL77yM5omA5pyJ6K+35rGC5Z2H5Li65byC5q2l6K+35rGC44CC5aaC5p6c6ZyA6KaB5Y+R6YCB5ZCM5q2l6K+35rGC77yM6K+35bCG5q2k6YCJ6aG56K6+572u5Li6IGZhbHNlXHJcbiAgICAgICAgdHlwZTogJ0dFVCcsIC8v6K+35rGC55qE5pa55byPXHJcbiAgICAgICAgZGF0YToge30sIC8v5Y+R57uZ5pyN5Yqh5Zmo55qE5pWw5o2uXHJcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAodGV4dCkgeyB9LCAvL+ivt+axguaIkOWKn+aJp+ihjOaWueazlVxyXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7IH0gLy/or7fmsYLlpLHotKXmiafooYzmlrnms5VcclxuICAgIH07XHJcblxyXG5cclxuICAgIHZhciBhRGF0YSA9IFtdOyAvL+WtmOWCqOaVsOaNrlxyXG4gICAgdmFyIHNEYXRhID0gJyc7IC8v5ou85o6l5pWw5o2uXHJcbiAgICAvL+WxnuaAp+imhuebllxyXG4gICAgZm9yICh2YXIgYXR0ciBpbiBteVNldHRpbmcpIHtcclxuICAgICAgICBzZXR0aW5nW2F0dHJdID0gbXlTZXR0aW5nW2F0dHJdO1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgYXR0ciBpbiBzZXR0aW5nLmRhdGEpIHtcclxuICAgICAgICBhRGF0YS5wdXNoKGF0dHIgKyAnPScgKyBmaWx0ZXIoc2V0dGluZy5kYXRhW2F0dHJdKSk7XHJcbiAgICB9XHJcbiAgICBzRGF0YSA9IGFEYXRhLmpvaW4oJyYnKTtcclxuICAgIHNldHRpbmcudHlwZSA9IHNldHRpbmcudHlwZS50b1VwcGVyQ2FzZSgpO1xyXG5cclxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKHNldHRpbmcudHlwZSA9PSAnR0VUJykgeyAvL2dldOaWueW8j+ivt+axglxyXG4gICAgICAgICAgICBzRGF0YSA9IHNldHRpbmcudXJsICsgJz8nICsgc0RhdGE7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKHNldHRpbmcudHlwZSwgc0RhdGEgKyAnJicgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgc2V0dGluZy5hc3luYyk7XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfSBlbHNlIHsgLy9wb3N05pa55byP6K+35rGCXHJcbiAgICAgICAgICAgIHhoci5vcGVuKHNldHRpbmcudHlwZSwgc2V0dGluZy51cmwsIHNldHRpbmcuYXN5bmMpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoc0RhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gaHR0cEVuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZXR0aW5nLmFzeW5jKSB7XHJcbiAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBodHRwRW5kLCBmYWxzZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGh0dHBFbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBodHRwRW5kKCkge1xyXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0KSB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xyXG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAvL+WwhuacjeWKoeWZqOi/lOWbnueahOaVsOaNru+8jOi9rOaNouaIkGpzb25cclxuXHJcbiAgICAgICAgICAgIGlmICgvYXBwbGljYXRpb25cXC9qc29uLy50ZXN0KGhlYWQpIHx8IHNldHRpbmcuZGF0YVR5cGUgPT09ICdqc29uJyAmJiAvXihcXHt8XFxbKShbXFxzXFxTXSkqPyhcXF18XFx9KSQvLnRlc3QocmVzcG9uc2UpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHNldHRpbmcuc3VjY2VzcyhyZXNwb25zZSwgc2V0dGluZywgeGhyKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldHRpbmcuZXJyb3Ioc2V0dGluZywgeGhyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHhoci5lbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgeGhyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBodHRwRW5kLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZmlsdGVyKHN0cikgeyAvL+eJueauiuWtl+espui9rOS5iVxyXG4gICAgICAgIHN0ciArPSAnJzsgLy/pmpDlvI/ovazmjaJcclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvJS9nLCAnJTI1Jyk7XHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL1xcKy9nLCAnJTJCJyk7XHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoLyAvZywgJyUyMCcpO1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXC8vZywgJyUyRicpO1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXD8vZywgJyUzRicpO1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8mL2csICclMjYnKTtcclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXFw9L2csICclM0QnKTtcclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvIy9nLCAnJTIzJyk7XHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH1cclxuICAgIHJldHVybiB4aHI7XHJcbn07XHJcblxyXG4vL+WwgeijhWFqYXggcG9zdOivt+axglxyXG5cclxuVG9vbC5wb3N0ID0gZnVuY3Rpb24gKHBhdGhuYW1lLCBkYXRhLCBzdWNjZXNzLCBlcnJvcikge1xyXG4gICAgdmFyIHNldHRpbmcgPSB7XHJcbiAgICAgICAgdXJsOiB0YXJnZXQgKyBwYXRobmFtZSwgLy/pu5jorqRhamF46K+35rGC5Zyw5Z2AXHJcbiAgICAgICAgdHlwZTogJ1BPU1QnLCAvL+ivt+axgueahOaWueW8j1xyXG4gICAgICAgIGRhdGE6IGRhdGEsIC8v5Y+R57uZ5pyN5Yqh5Zmo55qE5pWw5o2uXHJcbiAgICAgICAgc3VjY2Vzczogc3VjY2VzcyB8fCBmdW5jdGlvbiAoKSB7IH0sIC8v6K+35rGC5oiQ5Yqf5omn6KGM5pa55rOVXHJcbiAgICAgICAgZXJyb3I6IGVycm9yIHx8IGZ1bmN0aW9uICgpIHsgfSAvL+ivt+axguWksei0peaJp+ihjOaWueazlVxyXG4gICAgfTtcclxuICAgIHJldHVybiBUb29sLmFqYXgoc2V0dGluZyk7XHJcbn07XHJcblxyXG4vL+WwgeijhWFqYXggZ2V06K+35rGCXHJcblxyXG5Ub29sLmdldCA9IGZ1bmN0aW9uIChwYXRobmFtZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IpIHtcclxuICAgIHZhciBzZXR0aW5nID0ge1xyXG4gICAgICAgIHVybDogdGFyZ2V0ICsgcGF0aG5hbWUsIC8v6buY6K6kYWpheOivt+axguWcsOWdgFxyXG4gICAgICAgIHR5cGU6ICdHRVQnLCAvL+ivt+axgueahOaWueW8j1xyXG4gICAgICAgIGRhdGE6IGRhdGEsIC8v5Y+R57uZ5pyN5Yqh5Zmo55qE5pWw5o2uXHJcbiAgICAgICAgc3VjY2Vzczogc3VjY2VzcyB8fCBmdW5jdGlvbiAoKSB7IH0sIC8v6K+35rGC5oiQ5Yqf5omn6KGM5pa55rOVXHJcbiAgICAgICAgZXJyb3I6IGVycm9yIHx8IGZ1bmN0aW9uICgpIHsgfSAvL+ivt+axguWksei0peaJp+ihjOaWueazlVxyXG4gICAgfTtcclxuICAgIHJldHVybiBUb29sLmFqYXgoc2V0dGluZyk7XHJcbn07XHJcblxyXG5cclxuLy/moLzlvI/ljJbml7bpl7RcclxuXHJcblRvb2wuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIHZhciBkYXRlID0gbmV3IERhdGUoc3RyKTtcclxuICAgIHZhciB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBkYXRlLmdldFRpbWUoKTsgLy/njrDlnKjnmoTml7bpl7Qt5Lyg5YWl55qE5pe26Ze0ID0g55u45beu55qE5pe26Ze077yI5Y2V5L2NID0g5q+r56eS77yJXHJcbiAgICBpZiAodGltZSA8IDApIHtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9IGVsc2UgaWYgKHRpbWUgLyAxMDAwIDwgNjApIHtcclxuICAgICAgICByZXR1cm4gJ+WImuWImic7XHJcbiAgICB9IGVsc2UgaWYgKCh0aW1lIC8gNjAwMDApIDwgNjApIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoKHRpbWUgLyA2MDAwMCkpICsgJ+WIhumSn+WJjSc7XHJcbiAgICB9IGVsc2UgaWYgKCh0aW1lIC8gMzYwMDAwMCkgPCAyNCkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aW1lIC8gMzYwMDAwMCkgKyAn5bCP5pe25YmNJztcclxuICAgIH0gZWxzZSBpZiAoKHRpbWUgLyA4NjQwMDAwMCkgPCAzMSkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aW1lIC8gODY0MDAwMDApICsgJ+WkqeWJjSc7XHJcbiAgICB9IGVsc2UgaWYgKCh0aW1lIC8gMjU5MjAwMDAwMCkgPCAxMikge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aW1lIC8gMjU5MjAwMDAwMCkgKyAn5pyI5YmNJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRpbWUgLyAzMTUzNjAwMDAwMCkgKyAn5bm05YmNJztcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8v5pys5Zyw5pWw5o2u5a2Y5YKo5oiW6K+75Y+WXHJcblxyXG5Ub29sLmxvY2FsSXRlbSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8v5Yig6Zmk5pys5Zyw5pWw5o2uXHJcblxyXG5Ub29sLnJlbW92ZUxvY2FsSXRlbSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgIGlmIChrZXkpIHtcclxuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcclxuICAgIH1cclxuICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgpO1xyXG59XHJcblxyXG5Ub29sLnNldFVybFBhcmFtcyA9IGZ1bmN0aW9uKG9yaWdpbiwgcGFyYW1zKXtcclxuICAgIHZhciByZXN1bHQgPSBvcmlnaW47XHJcbiAgICBmb3IodmFyIGkgaW4gcGFyYW1zKXtcclxuICAgICAgICBpZighL1xcPy8udGVzdChyZXN1bHQpKXtcclxuICAgICAgICAgICAgcmVzdWx0ICs9ICc/JyArIGkgKyAnPScgKyBwYXJhbXNbaV07XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPScmJysgaSArICc9JyArIHBhcmFtc1tpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vLyDmnKzlnLDmlbDmja7lrZjlgqjmiJbor7vlj5ZcclxuVG9vbC5nZXRPclNldEl0ZW0gPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyDliKDpmaTmnKzlnLDmlbDmja5cclxuVG9vbC5yZW1vdmVJdGVtID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgaWYgKGtleSkge1xyXG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCk7XHJcbn1cclxuXHJcblRvb2wuYWRkRXZlbnQgPSBmdW5jdGlvbihlbCwgZXZlbnQsIGZuLCB0eXBlKSB7XHJcbiAgICB2YXIgdHlwZSA9IHR5cGUgfHwgZmFsc2U7XHJcbiAgICBpZih0eXBlb2YgZWwgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBldmVudCAhPT0gJ3N0cmluZycgfHwgdHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB0eXBlICE9PSAnYm9vbGVhbicpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCflj4LmlbDmoLzlvI/plJnor68nKTtcclxuICAgIH1cclxuICAgIGlmKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXtcclxuICAgICAgICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZm4sIHR5cGUpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIGVsLmF0dGFjaEV2ZW50KCdvbicrZXZlbnQsIGZuLCB0eXBlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHsgVG9vbCwgbWVyZ2VkIH1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdG9vbC9pbmRleC5qcyIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRpZiAodHlwZW9mIG1lbW9bc2VsZWN0b3JdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRtZW1vW3NlbGVjdG9yXSA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdH1cblxuXHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHR9O1xufSkoZnVuY3Rpb24gKHRhcmdldCkge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXG59KTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24pIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IGxpYjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImxpYlwiXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBUYWJJY29uIGZyb20gJy4vVGFiSWNvbic7XHJcbmltcG9ydCBVc2VySGVhZEltZyBmcm9tICcuL1VzZXJIZWFkSW1nJztcclxuaW1wb3J0IExvYWRpbmcgZnJvbSAnLi9Mb2FkaW5nJztcclxuaW1wb3J0IFRpcE1zZ1NpZ25pbiBmcm9tICcuL1RpcE1zZ1NpZ25Jbic7XHJcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9IZWFkZXInO1xyXG5pbXBvcnQgTm9EYXRhIGZyb20gJy4vTm9EYXRhJztcclxuXHJcbmV4cG9ydCB7IFRhYkljb24sIFVzZXJIZWFkSW1nLCBMb2FkaW5nLCBUaXBNc2dTaWduaW4sIEhlYWRlciwgTm9EYXRhIH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDUpKSgxMDkpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oNSkpKDYyKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVkdXgvZXMvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBUb29sIH0gZnJvbSAnLi4vdG9vbCc7XHJcbmltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcclxuY29uc3QgdGFyZ2V0ID0gJ2h0dHBzOi8vY25vZGVqcy5vcmcnOyAvL+ebruagh+e9keermVxyXG5cclxubGV0IGFjdGlvbnMgPSB7XHJcbiAgICAvL+mmlumhtVxyXG4gICAgZmV0Y2hMaXN0OiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuYmVnaW5GZXRjaExpc3Qob3B0aW9ucy50YWIpKTtcclxuICAgICAgICAgICAgY29uc3QgYWRkcmVzcyA9IHRhcmdldCArIFRvb2wuc2V0VXJsUGFyYW1zKHVybCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhcmdldCk7XHJcbiAgICAgICAgICAgIGZldGNoKGFkZHJlc3MpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5zdGF0dXMgIT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZmFpbEZldGNoTGlzdChyZXMuc3RhdHVzVGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihyZXMub2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmpzb24oKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZG9uZUZldGNoTGlzdChkYXRhLmRhdGEsIG9wdGlvbnMudGFiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5mYWlsRmV0Y2hMaXN0KGUuc3RhdHVzVGV4dCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBiZWdpbkZldGNoTGlzdDogdGFiID0+ICh7XHJcbiAgICAgICAgdHlwZTogJ0JFR0lOX0ZFVENIX0xJU1QnLFxyXG4gICAgICAgIHRhYjogdGFiXHJcbiAgICB9KSxcclxuXHJcbiAgICBkb25lRmV0Y2hMaXN0OiAoZGF0YSwgdGFiKSA9PiAoe1xyXG4gICAgICAgIHR5cGU6ICdET05FX0ZFVENIX0xJU1QnLFxyXG4gICAgICAgIHBheWxvYWQ6IGRhdGEsXHJcbiAgICAgICAgdGFiOiB0YWJcclxuICAgIH0pLFxyXG5cclxuICAgIGZhaWxGZXRjaExpc3Q6IGVyck1zZyA9PiAoe1xyXG4gICAgICAgIHR5cGU6ICdGQUlMX0ZFVENIX0xJU1QnLFxyXG4gICAgICAgIGVycm9yOiBuZXcgRXJyb3IoZXJyTXNnKVxyXG4gICAgfSksXHJcblxyXG4gICAgLy/or6bmg4XpobVcclxuICAgIGZldGNoVG9waWM6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5iZWdpbmZldGNoVG9waWMoKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoKS5mZXRjaFRvcGljO1xyXG4gICAgICAgICAgICBjb25zdCBhZGRyZXNzID0gdGFyZ2V0ICsgVG9vbC5zZXRVcmxQYXJhbXModXJsLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgZmV0Y2goYWRkcmVzcylcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzLnN0YXR1cyAhPSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5mYWlsZmV0Y2hUb3BpYyhyZXMuc3RhdHVzVGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihyZXMub2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmpzb24oKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZG9uZWZldGNoVG9waWMoZGF0YS5kYXRhKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5mYWlsZmV0Y2hUb3BpYyhlLnN0YXR1c1RleHQpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYmVnaW5mZXRjaFRvcGljOiAoKSA9PiAoe1xyXG4gICAgICAgIHR5cGU6ICdCRUdJTl9GRVRDSF9UT1BJQydcclxuICAgIH0pLFxyXG5cclxuICAgIGRvbmVmZXRjaFRvcGljOiBkYXRhID0+ICh7XHJcbiAgICAgICAgdHlwZTogJ0RPTkVfRkVUQ0hfVE9QSUMnLFxyXG4gICAgICAgIHBheWxvYWQ6IGRhdGFcclxuICAgIH0pLFxyXG5cclxuICAgIGZhaWxmZXRjaFRvcGljOiBlcnJNc2cgPT4gKHtcclxuICAgICAgICB0eXBlOiAnRkFJTF9GRVRDSF9UT1BJQycsXHJcbiAgICAgICAgZXJyb3I6IG5ldyBFcnJvcihlcnJNc2cpXHJcbiAgICB9KSxcclxuXHJcbiAgICAvL+WPkeihqFxyXG4gICAgY3JlYXRlVG9waWM6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5iZWdpbkNyZWF0ZVRvcGljKCkpO1xyXG4gICAgICAgICAgICBjb25zdCBhZGRyZXNzID0gdGFyZ2V0ICsgVG9vbC5zZXRVcmxQYXJhbXModXJsLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgZmV0Y2goYWRkcmVzcylcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzLnN0YXR1cyAhPSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5mYWlsQ3JlYXRlVG9waWMocmVzLnN0YXR1c1RleHQpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5qc29uKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChhY3Rpb25zLmRvbmVDcmVhdGVUb3BpYyhkYXRhLmRhdGEpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChhY3Rpb25zLmZhaWxDcmVhdGVUb3BpYyhlLnN0YXR1c1RleHQpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYmVnaW5DcmVhdGVUb3BpYzogKCkgPT4gKHtcclxuICAgICAgICB0eXBlOiAnQkVHSU5fQ1JFQVRFX1RPUElDJ1xyXG4gICAgfSksXHJcblxyXG4gICAgZG9uZUNyZWF0ZVRvcGljOiBkYXRhID0+ICh7XHJcbiAgICAgICAgdHlwZTogJ0RPTkVfQ1JFQVRFX1RPUElDJyxcclxuICAgICAgICBwYXlsb2FkOiBkYXRhXHJcbiAgICB9KSxcclxuXHJcbiAgICBmYWlsQ3JlYXRlVG9waWM6IGVyck1zZyA9PiAoe1xyXG4gICAgICAgIHR5cGU6ICdGQUlMX0NSRUFURV9UT1BJQycsXHJcbiAgICAgICAgZXJyb3I6IG5ldyBFcnJvcihlcnJNc2cpXHJcbiAgICB9KSxcclxuXHJcbiAgICAvL+a2iOaBr1xyXG4gICAgZmV0Y2hNZXNzYWdlOiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuYmVnaW5GZXRjaE1lc3NhZ2UoKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFkZHJlc3MgPSB0YXJnZXQgKyBUb29sLnNldFVybFBhcmFtcyh1cmwsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBmZXRjaChhZGRyZXNzKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXMuc3RhdHVzICE9IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChhY3Rpb25zLmZhaWxGZXRjaE1lc3NhZ2UocmVzLnN0YXR1c1RleHQpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5qc29uKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9ucy5kb25lRmV0Y2hNZXNzYWdlKGRhdGEuZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZmFpbEZldGNoTWVzc2FnZShlLnN0YXR1c1RleHQpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYmVnaW5GZXRjaE1lc3NhZ2U6ICgpID0+ICh7XHJcbiAgICAgICAgdHlwZTogJ0JFR0lOX0ZFVENIX01FU1NBR0UnXHJcbiAgICB9KSxcclxuXHJcbiAgICBkb25lRmV0Y2hNZXNzYWdlOiBkYXRhID0+ICh7XHJcbiAgICAgICAgdHlwZTogJ0RPTkVfRkVUQ0hfTUVTU0FHRScsXHJcbiAgICAgICAgcGF5bG9hZDogZGF0YVxyXG4gICAgfSksXHJcblxyXG4gICAgZmFpbEZldGNoTWVzc2FnZTogZXJyTXNnID0+ICh7XHJcbiAgICAgICAgdHlwZTogJ0ZBSUxfRkVUQ0hfTUVTU0FHRScsXHJcbiAgICAgICAgZXJyb3I6IG5ldyBFcnJvcihlcnJNc2cpXHJcbiAgICB9KSxcclxuXHJcbiAgICAvL+eZu+W9lVxyXG4gICAgbG9naW5JbjogKGRhdGEpID0+ICh7XHJcbiAgICAgICAgdHlwZTogJ0xPR0lOX0lOX1NVQ0NFU1MnLFxyXG4gICAgICAgIHBheWxvYWQ6IGRhdGFcclxuICAgIH0pLFxyXG5cclxuICAgIC8v6YCA5Ye655m75b2VXHJcbiAgICBsb2dpbk91dDogKCkgPT4gKHtcclxuICAgICAgICB0eXBlOiAnTE9HSU5fT1VUJ1xyXG4gICAgfSksXHJcblxyXG4gICAgLy/nlKjmiLfor6bmg4VcclxuICAgIGZldGNoRGV0YWlsOiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuYmVnaW5GZXRjaERldGFpbCgpKTtcclxuICAgICAgICAgICAgY29uc3QgYWRkcmVzcyA9IHRhcmdldCArIFRvb2wuc2V0VXJsUGFyYW1zKHVybCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGZldGNoKGFkZHJlc3MpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5zdGF0dXMgIT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZmFpbEZldGNoRGV0YWlsKHJlcy5zdGF0dXNUZXh0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5vaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuanNvbigpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZG9uZUZldGNoRGV0YWlsKGRhdGEuZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZmFpbEZldGNoRGV0YWlsKGUuc3RhdHVzVGV4dCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBiZWdpbkZldGNoRGV0YWlsOiAoKSA9PiAoe1xyXG4gICAgICAgIHR5cGU6ICdCRUdJTl9GRVRDSF9ERVRBSUwnXHJcbiAgICB9KSxcclxuXHJcbiAgICBkb25lRmV0Y2hEZXRhaWw6IGRhdGEgPT4gKHtcclxuICAgICAgICB0eXBlOiAnRE9ORV9GRVRDSF9ERVRBSUwnLFxyXG4gICAgICAgIHBheWxvYWQ6IGRhdGFcclxuICAgIH0pLFxyXG5cclxuICAgIGZhaWxGZXRjaERldGFpbDogZXJyTXNnID0+ICh7XHJcbiAgICAgICAgdHlwZTogJ0ZBSUxfRkVUQ0hfREVUQUlMJyxcclxuICAgICAgICBlcnJvcjogbmV3IEVycm9yKGVyck1zZylcclxuICAgIH0pLFxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFjdGlvbnM7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FjdGlvbnMvaW5kZXguanMiLCIndXNlIHN0cmljdCc7XG52YXIgc3RyaWN0VXJpRW5jb2RlID0gcmVxdWlyZSgnc3RyaWN0LXVyaS1lbmNvZGUnKTtcbnZhciBvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbmZ1bmN0aW9uIGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRzKSB7XG5cdHN3aXRjaCAob3B0cy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzpcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgaW5kZXgpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlID09PSBudWxsID8gW1xuXHRcdFx0XHRcdGVuY29kZShrZXksIG9wdHMpLFxuXHRcdFx0XHRcdCdbJyxcblx0XHRcdFx0XHRpbmRleCxcblx0XHRcdFx0XHQnXSdcblx0XHRcdFx0XS5qb2luKCcnKSA6IFtcblx0XHRcdFx0XHRlbmNvZGUoa2V5LCBvcHRzKSxcblx0XHRcdFx0XHQnWycsXG5cdFx0XHRcdFx0ZW5jb2RlKGluZGV4LCBvcHRzKSxcblx0XHRcdFx0XHQnXT0nLFxuXHRcdFx0XHRcdGVuY29kZSh2YWx1ZSwgb3B0cylcblx0XHRcdFx0XS5qb2luKCcnKTtcblx0XHRcdH07XG5cblx0XHRjYXNlICdicmFja2V0Jzpcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHRyZXR1cm4gdmFsdWUgPT09IG51bGwgPyBlbmNvZGUoa2V5LCBvcHRzKSA6IFtcblx0XHRcdFx0XHRlbmNvZGUoa2V5LCBvcHRzKSxcblx0XHRcdFx0XHQnW109Jyxcblx0XHRcdFx0XHRlbmNvZGUodmFsdWUsIG9wdHMpXG5cdFx0XHRcdF0uam9pbignJyk7XG5cdFx0XHR9O1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHRyZXR1cm4gdmFsdWUgPT09IG51bGwgPyBlbmNvZGUoa2V5LCBvcHRzKSA6IFtcblx0XHRcdFx0XHRlbmNvZGUoa2V5LCBvcHRzKSxcblx0XHRcdFx0XHQnPScsXG5cdFx0XHRcdFx0ZW5jb2RlKHZhbHVlLCBvcHRzKVxuXHRcdFx0XHRdLmpvaW4oJycpO1xuXHRcdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiBwYXJzZXJGb3JBcnJheUZvcm1hdChvcHRzKSB7XG5cdHZhciByZXN1bHQ7XG5cblx0c3dpdGNoIChvcHRzLmFycmF5Rm9ybWF0KSB7XG5cdFx0Y2FzZSAnaW5kZXgnOlxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikge1xuXHRcdFx0XHRyZXN1bHQgPSAvXFxbKFxcZCopXFxdJC8uZXhlYyhrZXkpO1xuXG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9cXFtcXGQqXFxdJC8sICcnKTtcblxuXHRcdFx0XHRpZiAoIXJlc3VsdCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoYWNjdW11bGF0b3Jba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHt9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XVtyZXN1bHRbMV1dID0gdmFsdWU7XG5cdFx0XHR9O1xuXG5cdFx0Y2FzZSAnYnJhY2tldCc6XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSB7XG5cdFx0XHRcdHJlc3VsdCA9IC8oXFxbXFxdKSQvLmV4ZWMoa2V5KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1xcW1xcXSQvLCAnJyk7XG5cblx0XHRcdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbdmFsdWVdO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbXS5jb25jYXQoYWNjdW11bGF0b3Jba2V5XSwgdmFsdWUpO1xuXHRcdFx0fTtcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSB7XG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IFtdLmNvbmNhdChhY2N1bXVsYXRvcltrZXldLCB2YWx1ZSk7XG5cdFx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWx1ZSwgb3B0cykge1xuXHRpZiAob3B0cy5lbmNvZGUpIHtcblx0XHRyZXR1cm4gb3B0cy5zdHJpY3QgPyBzdHJpY3RVcmlFbmNvZGUodmFsdWUpIDogZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24ga2V5c1NvcnRlcihpbnB1dCkge1xuXHRpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcblx0XHRyZXR1cm4gaW5wdXQuc29ydCgpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4ga2V5c1NvcnRlcihPYmplY3Qua2V5cyhpbnB1dCkpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRcdHJldHVybiBOdW1iZXIoYSkgLSBOdW1iZXIoYik7XG5cdFx0fSkubWFwKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBpbnB1dFtrZXldO1xuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0O1xufVxuXG5leHBvcnRzLmV4dHJhY3QgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdHJldHVybiBzdHIuc3BsaXQoJz8nKVsxXSB8fCAnJztcbn07XG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAoc3RyLCBvcHRzKSB7XG5cdG9wdHMgPSBvYmplY3RBc3NpZ24oe2FycmF5Rm9ybWF0OiAnbm9uZSd9LCBvcHRzKTtcblxuXHR2YXIgZm9ybWF0dGVyID0gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0cyk7XG5cblx0Ly8gQ3JlYXRlIGFuIG9iamVjdCB3aXRoIG5vIHByb3RvdHlwZVxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL3F1ZXJ5LXN0cmluZy9pc3N1ZXMvNDdcblx0dmFyIHJldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0aWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdHN0ciA9IHN0ci50cmltKCkucmVwbGFjZSgvXihcXD98I3wmKS8sICcnKTtcblxuXHRpZiAoIXN0cikge1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRzdHIuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJhbSkge1xuXHRcdHZhciBwYXJ0cyA9IHBhcmFtLnJlcGxhY2UoL1xcKy9nLCAnICcpLnNwbGl0KCc9Jyk7XG5cdFx0Ly8gRmlyZWZveCAocHJlIDQwKSBkZWNvZGVzIGAlM0RgIHRvIGA9YFxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvcXVlcnktc3RyaW5nL3B1bGwvMzdcblx0XHR2YXIga2V5ID0gcGFydHMuc2hpZnQoKTtcblx0XHR2YXIgdmFsID0gcGFydHMubGVuZ3RoID4gMCA/IHBhcnRzLmpvaW4oJz0nKSA6IHVuZGVmaW5lZDtcblxuXHRcdC8vIG1pc3NpbmcgYD1gIHNob3VsZCBiZSBgbnVsbGA6XG5cdFx0Ly8gaHR0cDovL3czLm9yZy9UUi8yMDEyL1dELXVybC0yMDEyMDUyNC8jY29sbGVjdC11cmwtcGFyYW1ldGVyc1xuXHRcdHZhbCA9IHZhbCA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGRlY29kZVVSSUNvbXBvbmVudCh2YWwpO1xuXG5cdFx0Zm9ybWF0dGVyKGRlY29kZVVSSUNvbXBvbmVudChrZXkpLCB2YWwsIHJldCk7XG5cdH0pO1xuXG5cdHJldHVybiBPYmplY3Qua2V5cyhyZXQpLnNvcnQoKS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwga2V5KSB7XG5cdFx0dmFyIHZhbCA9IHJldFtrZXldO1xuXHRcdGlmIChCb29sZWFuKHZhbCkgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsKSkge1xuXHRcdFx0Ly8gU29ydCBvYmplY3Qga2V5cywgbm90IHZhbHVlc1xuXHRcdFx0cmVzdWx0W2tleV0gPSBrZXlzU29ydGVyKHZhbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdFtrZXldID0gdmFsO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sIE9iamVjdC5jcmVhdGUobnVsbCkpO1xufTtcblxuZXhwb3J0cy5zdHJpbmdpZnkgPSBmdW5jdGlvbiAob2JqLCBvcHRzKSB7XG5cdHZhciBkZWZhdWx0cyA9IHtcblx0XHRlbmNvZGU6IHRydWUsXG5cdFx0c3RyaWN0OiB0cnVlLFxuXHRcdGFycmF5Rm9ybWF0OiAnbm9uZSdcblx0fTtcblxuXHRvcHRzID0gb2JqZWN0QXNzaWduKGRlZmF1bHRzLCBvcHRzKTtcblxuXHR2YXIgZm9ybWF0dGVyID0gZW5jb2RlckZvckFycmF5Rm9ybWF0KG9wdHMpO1xuXG5cdHJldHVybiBvYmogPyBPYmplY3Qua2V5cyhvYmopLnNvcnQoKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuXHRcdHZhciB2YWwgPSBvYmpba2V5XTtcblxuXHRcdGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGlmICh2YWwgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiBlbmNvZGUoa2V5LCBvcHRzKTtcblx0XHR9XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0gW107XG5cblx0XHRcdHZhbC5zbGljZSgpLmZvckVhY2goZnVuY3Rpb24gKHZhbDIpIHtcblx0XHRcdFx0aWYgKHZhbDIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGZvcm1hdHRlcihrZXksIHZhbDIsIHJlc3VsdC5sZW5ndGgpKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oJyYnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0cykgKyAnPScgKyBlbmNvZGUodmFsLCBvcHRzKTtcblx0fSkuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG5cdFx0cmV0dXJuIHgubGVuZ3RoID4gMDtcblx0fSkuam9pbignJicpIDogJyc7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9xdWVyeS1zdHJpbmcvaW5kZXguanMiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIudG9waWMtaGVhZCB7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJhY2tncm91bmQ6ICM4MGJkMDE7XFxuICBsaW5lLWhlaWdodDogNjBweDtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICByaWdodDogMDtcXG59XFxuLnRvcGljLWhlYWQgYSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBjb2xvcjogI2ZmZjtcXG4gIHRvcDogMDtcXG59XFxuLnRvcGljLWhlYWQgYSBpIHtcXG4gIGZvbnQtc2l6ZTogMjRweDtcXG59XFxuLnRvcGljLWhlYWQgYS5sZWZ0IHtcXG4gIGxlZnQ6IDEwcHg7XFxufVxcbi50b3BpYy1oZWFkIGEucmlnaHQge1xcbiAgcmlnaHQ6IDEwcHg7XFxufVxcbi50b3BpYy1oZWFkIC50aXRsZSB7XFxuICBmb250LXNpemU6IDIwcHg7XFxuICBjb2xvcjogI2ZmZjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlcj97XCJtb2R1bGVzXCI6ZmFsc2V9IS4vfi9wb3N0Y3NzLWxvYWRlci9saWI/e1wicGx1Z2luc1wiOltudWxsXX0hLi9+L2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3JjL2NvbXBvbmVudHMvSGVhZGVyL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5kYXRhLWxvYWQgLm1zZyB7XFxuICBsaW5lLWhlaWdodDogNzBweDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG59XFxuLmRhdGEtbG9hZC10cnVlIHtcXG4gIG1hcmdpbjogMjBweCBhdXRvIDIwcHggYXV0bztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIC13ZWJraXQtYW5pbWF0aW9uOiByb3RhdGUtZm9yZXZlciAxcyBpbmZpbml0ZSBsaW5lYXI7XFxuICAgICAgICAgIGFuaW1hdGlvbjogcm90YXRlLWZvcmV2ZXIgMXMgaW5maW5pdGUgbGluZWFyO1xcbiAgaGVpZ2h0OiAzMHB4O1xcbiAgd2lkdGg6IDMwcHg7XFxuICBib3JkZXI6IDRweCBzb2xpZCAjODBiZDAxO1xcbiAgYm9yZGVyLXJpZ2h0LWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG59XFxuLmRhdGEtbG9hZC10cnVlIC5tc2cge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuQC13ZWJraXQta2V5ZnJhbWVzIHJvdGF0ZS1mb3JldmVyIHtcXG4gIDAlIHtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XFxuICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyByb3RhdGUtZm9yZXZlciB7XFxuICAwJSB7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxuICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xcbiAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XFxuICB9XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyP3tcIm1vZHVsZXNcIjpmYWxzZX0hLi9+L3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJwbHVnaW5zXCI6W251bGxdfSEuL34vbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zcmMvY29tcG9uZW50cy9Mb2FkaW5nL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLyohIGh0dHBzOi8vZ2l0aHViLmNvbS9senhiL2ZsZXguY3NzICovW2RhdGEtZmxleF17ZGlzcGxheTotd2Via2l0LWJveDtkaXNwbGF5Oi1tcy1mbGV4Ym94O2Rpc3BsYXk6ZmxleH1bZGF0YS1mbGV4XT4qe2Rpc3BsYXk6YmxvY2t9W2RhdGEtZmxleF0+W2RhdGEtZmxleF17ZGlzcGxheTotd2Via2l0LWJveDtkaXNwbGF5Oi1tcy1mbGV4Ym94O2Rpc3BsYXk6ZmxleH1bZGF0YS1mbGV4fj1cXFwiZGlyOmxlZnRcXFwiXXstd2Via2l0LWJveC1vcmllbnQ6aG9yaXpvbnRhbDstd2Via2l0LWJveC1kaXJlY3Rpb246bm9ybWFsOy1tcy1mbGV4LWRpcmVjdGlvbjpyb3c7ZmxleC1kaXJlY3Rpb246cm93fVtkYXRhLWZsZXh+PVxcXCJkaXI6cmlnaHRcXFwiXXstd2Via2l0LWJveC1vcmllbnQ6aG9yaXpvbnRhbDstd2Via2l0LWJveC1kaXJlY3Rpb246cmV2ZXJzZTstbXMtZmxleC1kaXJlY3Rpb246cm93LXJldmVyc2U7ZmxleC1kaXJlY3Rpb246cm93LXJldmVyc2U7LXdlYmtpdC1ib3gtcGFjazplbmR9W2RhdGEtZmxleH49XFxcImRpcjp0b3BcXFwiXXstd2Via2l0LWJveC1vcmllbnQ6dmVydGljYWw7LXdlYmtpdC1ib3gtZGlyZWN0aW9uOm5vcm1hbDstbXMtZmxleC1kaXJlY3Rpb246Y29sdW1uO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbn1bZGF0YS1mbGV4fj1cXFwiZGlyOmJvdHRvbVxcXCJdey13ZWJraXQtYm94LW9yaWVudDp2ZXJ0aWNhbDstd2Via2l0LWJveC1kaXJlY3Rpb246cmV2ZXJzZTstbXMtZmxleC1kaXJlY3Rpb246Y29sdW1uLXJldmVyc2U7ZmxleC1kaXJlY3Rpb246Y29sdW1uLXJldmVyc2U7LXdlYmtpdC1ib3gtcGFjazplbmR9W2RhdGEtZmxleH49XFxcIm1haW46bGVmdFxcXCJdey13ZWJraXQtYm94LXBhY2s6c3RhcnQ7LW1zLWZsZXgtcGFjazpzdGFydDtqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1zdGFydH1bZGF0YS1mbGV4fj1cXFwibWFpbjpyaWdodFxcXCJdey13ZWJraXQtYm94LXBhY2s6ZW5kOy1tcy1mbGV4LXBhY2s6ZW5kO2p1c3RpZnktY29udGVudDpmbGV4LWVuZH1bZGF0YS1mbGV4fj1cXFwibWFpbjpqdXN0aWZ5XFxcIl17LXdlYmtpdC1ib3gtcGFjazpqdXN0aWZ5Oy1tcy1mbGV4LXBhY2s6anVzdGlmeTtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbn1bZGF0YS1mbGV4fj1cXFwibWFpbjpjZW50ZXJcXFwiXXstd2Via2l0LWJveC1wYWNrOmNlbnRlcjstbXMtZmxleC1wYWNrOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyfVtkYXRhLWZsZXh+PVxcXCJjcm9zczp0b3BcXFwiXXstd2Via2l0LWJveC1hbGlnbjpzdGFydDstbXMtZmxleC1hbGlnbjpzdGFydDthbGlnbi1pdGVtczpmbGV4LXN0YXJ0fVtkYXRhLWZsZXh+PVxcXCJjcm9zczpib3R0b21cXFwiXXstd2Via2l0LWJveC1hbGlnbjplbmQ7LW1zLWZsZXgtYWxpZ246ZW5kO2FsaWduLWl0ZW1zOmZsZXgtZW5kfVtkYXRhLWZsZXh+PVxcXCJjcm9zczpjZW50ZXJcXFwiXXstd2Via2l0LWJveC1hbGlnbjpjZW50ZXI7LW1zLWZsZXgtYWxpZ246Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcn1bZGF0YS1mbGV4fj1cXFwiY3Jvc3M6YmFzZWxpbmVcXFwiXXstd2Via2l0LWJveC1hbGlnbjpiYXNlbGluZTstbXMtZmxleC1hbGlnbjpiYXNlbGluZTthbGlnbi1pdGVtczpiYXNlbGluZX1bZGF0YS1mbGV4fj1cXFwiY3Jvc3M6c3RyZXRjaFxcXCJdey13ZWJraXQtYm94LWFsaWduOnN0cmV0Y2g7LW1zLWZsZXgtYWxpZ246c3RyZXRjaDthbGlnbi1pdGVtczpzdHJldGNofVtkYXRhLWZsZXh+PVxcXCJib3g6bWVhblxcXCJdPiosW2RhdGEtZmxleH49XFxcImJveDpmaXJzdFxcXCJdPiosW2RhdGEtZmxleH49XFxcImJveDpsYXN0XFxcIl0+KixbZGF0YS1mbGV4fj1cXFwiYm94Omp1c3RpZnlcXFwiXT4qe3dpZHRoOjA7aGVpZ2h0OmF1dG87LXdlYmtpdC1ib3gtZmxleDoxOy1tcy1mbGV4LXBvc2l0aXZlOjE7ZmxleC1ncm93OjE7LW1zLWZsZXgtbmVnYXRpdmU6MTtmbGV4LXNocmluazoxfVtkYXRhLWZsZXh+PVxcXCJib3g6Zmlyc3RcXFwiXT46Zmlyc3QtY2hpbGQsW2RhdGEtZmxleH49XFxcImJveDpsYXN0XFxcIl0+Omxhc3QtY2hpbGQsW2RhdGEtZmxleH49XFxcImJveDpqdXN0aWZ5XFxcIl0+OmZpcnN0LWNoaWxkLFtkYXRhLWZsZXh+PVxcXCJib3g6anVzdGlmeVxcXCJdPjpsYXN0LWNoaWxke3dpZHRoOmF1dG87LXdlYmtpdC1ib3gtZmxleDowOy1tcy1mbGV4LXBvc2l0aXZlOjA7ZmxleC1ncm93OjA7LW1zLWZsZXgtbmVnYXRpdmU6MDtmbGV4LXNocmluazowfVtkYXRhLWZsZXh+PVxcXCJkaXI6dG9wXFxcIl1bZGF0YS1mbGV4fj1cXFwiYm94Om1lYW5cXFwiXT4qLFtkYXRhLWZsZXh+PVxcXCJkaXI6dG9wXFxcIl1bZGF0YS1mbGV4fj1cXFwiYm94OmZpcnN0XFxcIl0+KixbZGF0YS1mbGV4fj1cXFwiZGlyOnRvcFxcXCJdW2RhdGEtZmxleH49XFxcImJveDpsYXN0XFxcIl0+KixbZGF0YS1mbGV4fj1cXFwiZGlyOnRvcFxcXCJdW2RhdGEtZmxleH49XFxcImJveDpqdXN0aWZ5XFxcIl0+KixbZGF0YS1mbGV4fj1cXFwiZGlyOmJvdHRvbVxcXCJdW2RhdGEtZmxleH49XFxcImJveDptZWFuXFxcIl0+KixbZGF0YS1mbGV4fj1cXFwiZGlyOmJvdHRvbVxcXCJdW2RhdGEtZmxleH49XFxcImJveDpmaXJzdFxcXCJdPiosW2RhdGEtZmxleH49XFxcImRpcjpib3R0b21cXFwiXVtkYXRhLWZsZXh+PVxcXCJib3g6bGFzdFxcXCJdPiosW2RhdGEtZmxleH49XFxcImRpcjpib3R0b21cXFwiXVtkYXRhLWZsZXh+PVxcXCJib3g6anVzdGlmeVxcXCJdPip7d2lkdGg6YXV0bztoZWlnaHQ6MDstd2Via2l0LWJveC1mbGV4OjE7LW1zLWZsZXgtcG9zaXRpdmU6MTtmbGV4LWdyb3c6MTstbXMtZmxleC1uZWdhdGl2ZToxO2ZsZXgtc2hyaW5rOjF9W2RhdGEtZmxleH49XFxcImRpcjp0b3BcXFwiXVtkYXRhLWZsZXh+PVxcXCJib3g6Zmlyc3RcXFwiXT46Zmlyc3QtY2hpbGQsW2RhdGEtZmxleH49XFxcImRpcjp0b3BcXFwiXVtkYXRhLWZsZXh+PVxcXCJib3g6bGFzdFxcXCJdPjpsYXN0LWNoaWxkLFtkYXRhLWZsZXh+PVxcXCJkaXI6dG9wXFxcIl1bZGF0YS1mbGV4fj1cXFwiYm94Omp1c3RpZnlcXFwiXT46Zmlyc3QtY2hpbGQsW2RhdGEtZmxleH49XFxcImRpcjp0b3BcXFwiXVtkYXRhLWZsZXh+PVxcXCJib3g6anVzdGlmeVxcXCJdPjpsYXN0LWNoaWxkLFtkYXRhLWZsZXh+PVxcXCJkaXI6Ym90dG9tXFxcIl1bZGF0YS1mbGV4fj1cXFwiYm94OmZpcnN0XFxcIl0+OmZpcnN0LWNoaWxkLFtkYXRhLWZsZXh+PVxcXCJkaXI6Ym90dG9tXFxcIl1bZGF0YS1mbGV4fj1cXFwiYm94Omxhc3RcXFwiXT46bGFzdC1jaGlsZCxbZGF0YS1mbGV4fj1cXFwiZGlyOmJvdHRvbVxcXCJdW2RhdGEtZmxleH49XFxcImJveDpqdXN0aWZ5XFxcIl0+OmZpcnN0LWNoaWxkIFtkYXRhLWZsZXh+PVxcXCJkaXI6Ym90dG9tXFxcIl1bZGF0YS1mbGV4fj1cXFwiYm94Omp1c3RpZnlcXFwiXT46bGFzdC1jaGlsZHtoZWlnaHQ6YXV0bzstd2Via2l0LWJveC1mbGV4OjA7LW1zLWZsZXgtcG9zaXRpdmU6MDtmbGV4LWdyb3c6MDstbXMtZmxleC1uZWdhdGl2ZTowO2ZsZXgtc2hyaW5rOjB9W2RhdGEtZmxleC1ib3g9XFxcIjBcXFwiXXstd2Via2l0LWJveC1mbGV4OjA7LW1zLWZsZXgtcG9zaXRpdmU6MDtmbGV4LWdyb3c6MDstbXMtZmxleC1uZWdhdGl2ZTowO2ZsZXgtc2hyaW5rOjB9W2RhdGEtZmxleC1ib3g9XFxcIjFcXFwiXXstd2Via2l0LWJveC1mbGV4OjE7LW1zLWZsZXgtcG9zaXRpdmU6MTtmbGV4LWdyb3c6MTstbXMtZmxleC1uZWdhdGl2ZToxO2ZsZXgtc2hyaW5rOjF9W2RhdGEtZmxleC1ib3g9XFxcIjJcXFwiXXstd2Via2l0LWJveC1mbGV4OjI7LW1zLWZsZXgtcG9zaXRpdmU6MjtmbGV4LWdyb3c6MjstbXMtZmxleC1uZWdhdGl2ZToyO2ZsZXgtc2hyaW5rOjJ9W2RhdGEtZmxleC1ib3g9XFxcIjNcXFwiXXstd2Via2l0LWJveC1mbGV4OjM7LW1zLWZsZXgtcG9zaXRpdmU6MztmbGV4LWdyb3c6MzstbXMtZmxleC1uZWdhdGl2ZTozO2ZsZXgtc2hyaW5rOjN9W2RhdGEtZmxleC1ib3g9XFxcIjRcXFwiXXstd2Via2l0LWJveC1mbGV4OjQ7LW1zLWZsZXgtcG9zaXRpdmU6NDtmbGV4LWdyb3c6NDstbXMtZmxleC1uZWdhdGl2ZTo0O2ZsZXgtc2hyaW5rOjR9W2RhdGEtZmxleC1ib3g9XFxcIjVcXFwiXXstd2Via2l0LWJveC1mbGV4OjU7LW1zLWZsZXgtcG9zaXRpdmU6NTtmbGV4LWdyb3c6NTstbXMtZmxleC1uZWdhdGl2ZTo1O2ZsZXgtc2hyaW5rOjV9W2RhdGEtZmxleC1ib3g9XFxcIjZcXFwiXXstd2Via2l0LWJveC1mbGV4OjY7LW1zLWZsZXgtcG9zaXRpdmU6NjtmbGV4LWdyb3c6NjstbXMtZmxleC1uZWdhdGl2ZTo2O2ZsZXgtc2hyaW5rOjZ9W2RhdGEtZmxleC1ib3g9XFxcIjdcXFwiXXstd2Via2l0LWJveC1mbGV4Ojc7LW1zLWZsZXgtcG9zaXRpdmU6NztmbGV4LWdyb3c6NzstbXMtZmxleC1uZWdhdGl2ZTo3O2ZsZXgtc2hyaW5rOjd9W2RhdGEtZmxleC1ib3g9XFxcIjhcXFwiXXstd2Via2l0LWJveC1mbGV4Ojg7LW1zLWZsZXgtcG9zaXRpdmU6ODtmbGV4LWdyb3c6ODstbXMtZmxleC1uZWdhdGl2ZTo4O2ZsZXgtc2hyaW5rOjh9W2RhdGEtZmxleC1ib3g9XFxcIjlcXFwiXXstd2Via2l0LWJveC1mbGV4Ojk7LW1zLWZsZXgtcG9zaXRpdmU6OTtmbGV4LWdyb3c6OTstbXMtZmxleC1uZWdhdGl2ZTo5O2ZsZXgtc2hyaW5rOjl9W2RhdGEtZmxleC1ib3g9XFxcIjEwXFxcIl17LXdlYmtpdC1ib3gtZmxleDoxMDstbXMtZmxleC1wb3NpdGl2ZToxMDtmbGV4LWdyb3c6MTA7LW1zLWZsZXgtbmVnYXRpdmU6MTA7ZmxleC1zaHJpbms6MTB9XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXI/e1wibW9kdWxlc1wiOmZhbHNlfSEuL34vcG9zdGNzcy1sb2FkZXIvbGliP3t9IS4vfi9mbGV4LmNzcy9kaXN0L2RhdGEtZmxleC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogb2N0aWNvbnMtbGluaztcXG4gIHNyYzogdXJsKGRhdGE6Zm9udC93b2ZmO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGQwOUdSZ0FCQUFBQUFBWndBQkFBQUFBQUNGUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCRVUwbEhBQUFHYUFBQUFBZ0FBQUFJQUFBQUFVZFRWVUlBQUFaY0FBQUFDZ0FBQUFvQUFRQUFUMU12TWdBQUF5UUFBQUJKQUFBQVlGWUVVM1JqYldGd0FBQURjQUFBQUVVQUFBQ0FBSlRodm1OMmRDQUFBQVRrQUFBQUJBQUFBQVFBQUFBQVpuQm5iUUFBQTdnQUFBQ3lBQUFCQ1VNKzhJaG5ZWE53QUFBR1RBQUFBQkFBQUFBUUFCb0FJMmRzZVdZQUFBRnNBQUFCUEFBQUFad2NFcTl0YUdWaFpBQUFBc2dBQUFBMEFBQUFOZ2g0YTkxb2FHVmhBQUFEQ0FBQUFCb0FBQUFrQ0E4RFJHaHRkSGdBQUFMOEFBQUFEQUFBQUF3R0FBQ2ZiRzlqWVFBQUFzQUFBQUFJQUFBQUNBQmlBVEJ0WVhod0FBQUNxQUFBQUJnQUFBQWdBQThBU201aGJXVUFBQVRvQUFBQlFnQUFBbFh1NzNzT2NHOXpkQUFBQml3QUFBQWVBQUFBTUUzUXBPQndjbVZ3QUFBRWJBQUFBSFlBQUFCL2FGR3BrM2phVFk2eGE4SkFHTVcvTzYyQkRpMHRKTFlRaW5jWEV5cFlJaUdKalNnSG5pUTZ1bVRzVUV5TG01QlY2TkRCUDhUcHRzNkYwditrLzBhbjJpK2l0SER3M3YyKzkrREJLVHpzSk5uV0pOVGdIRXk0QmdHM0VNSTlEQ0VET0dFWHpEQURVNWhCS01JZ05QWnFvRDNTaWxWYVhaQ0VSMy9JN0F0eEVKTHR6enVaZkkrVlZrcHJ4VGxYU2hXS2IzVEJlY0cxMXJ3b05sbW1uMVAyV1ljSmN6bDMyZXRTcEtuemlDN2xReVdlMXNtVlB5L0x0N0tjKzB2V1kvZ0FnSUlFcUFOOXdlMHB3S1hyZWlNYXN4dmFiRFFNTTRyaU8rcXhNMm9nd0RHT1pUWHh3eERpeWNRSWNvWUZCTGo1SzNFSWFTY3RBcTJrVFlpdyt5bWhjZTd2d005alNxTzhKeVZkNVJIOWd5VHQyK0oveVVtWWxJUjBzMDRuNis3Vm0xb3plelVlTEVhVWpoYURTdVhId1ZSZ3ZMSm4xdFE3eGl1VnYvb2NUUkY0Mm1OZ1pHQmdZR2J3Wk9CaUFBRkdKQklNQUFpekFGb0FBQUJpQUdJQXpuamFZMkJrWUdBQTRpbjh6d1hpK1cyK01qQ3pNSURBcFN3dlh6Qzk3WjRJZzhOL0J4WUdaZ2NnbDUyQkNTUUtBQTNqQ1Y4Q0FBQmZBQUFBQUFRQUFFQjQybU5nWkdCZzRmM3ZBQ1FaUUFCSU1qS2dBbVlBS0VnQlhnQUFlTnBqWUdZNndUaUJnWldCZzJrbVV4b0RBNE1QaEdaTVl6QmkxQUh5Z1ZMWVFVQ2Fhd3FEQTRQQ2h4aG1oLzhPRERFc3ZBd0hnTUtNSURuR0wweDdnSlFDQXdNQUpkNE1Gd0FBQUhqYVkyQmdZR2FBNERBR1JnWVFrQUh5R01GOE5nWXJJTTNKSUFHVllZRFQrQUVqQXd1REZwQm1BOUtNREV3TUNoOWkvdjhIOHNIMC80ZFFjMWlBbUFrQUxhVUtMZ0FBQUhqYVRZOUxEc0lnRUlidGdxSFVQcERpM2dQb0JWeVJUbVRkZE9tcVRYVGhFWHFyb2IyZ1ExRmp3cER2ZndDQmRtZFhDNUFWS0Z1M2U1TWZORkoyOUtUUVQ0OE9iOS9scVl3T0daeGVVZWxOMlUyUjYrY0FyZ3RDSnBhdVc3VVFCcW5Ga1VzakFZL2tPVTFjUCtEQWd2eHduMWNoWkR3VWJkNkNGaW1HWHd6d0Y2dFBiRkljakVsK3Z2bU0vYnlBNDhlNnRXcktBcm00WkpsQ2Jkc3J4a3NMMUF3V24veUJTSktwWWJxOEFYYWFUYjhBQUhqYTI4akF3T0MwMFpyQmVRTkRRT1dPLy9zZEJCZ1lHUmlZV1lBRUVMRXdNVEU0dXpvNVp6bzViMkJ4ZG5GT2NBTHhOakE2YjJCeVRzd0M4all3ZzBWbE51b0NUV0FNcU56TXpzb0sxckVoTnFCeUV5ZXJnNVBNSmxZdVZ1ZUVUS2NkLzg5dUJwbnB2SUVWb21lSExvTXNBQWUxSWQ0QUFBQUFBQUI0Mm9XUVQwN0NRQlRHdjBKQmhhZ2s3SFF6S3hjYTJzSkNFMWhEdDRRRis5Sk9TMG5iYWFZRENRZndDSjdBdTNBSGorTE8xM0ZNbW02Y2w3Nzg1dnZlbjBrQmpIQ0JoZnBZdU5hNVBoMWMwZTJYdTNqRXZXRzdVZFBETFo0Tjkybk9tK0VCWHVBYkhtSU1TUk1zKzRhVUVkNE5kM0NIRDhOZHZPTFRzQTJHTDhNOVBPRGJjTCtoRDdDMXhvYUhlTEpTRWFvMEZFVzE0Y2t4QytUVThUeHZzWTZYMGVMUG1SaHJ5MldWaW9McGtyYnA4NExMUVBHSTdjNnNPaVV6cFdJV1M1R3psU2dVenpMQlNpa09QRlRPWHFseTdycXgwWjFRNUJBSW9aQlNGaWhRWVFPT0JFZGtDT2dYVE9IQTA3SEFHakdXaUlqYVBaTlcxMy8rbG02UzlGVDdyTEhGSjZmUWJrQVRPRzFqMk9GTXVjS0pKc3hJVmZRT1JsKzlKeWRhNlNsMWRVWWhTQ20xZHlDbGZvZUR2ZTRxTVlkTEViZnFIZjNPL0FkRHVtc2pBQUI0Mm1OZ1lvQUFaUVlqQm15QUdZUVptZGhMOHpMZERFeWRBUmZvQXFJQUFBQUJBQU1BQndBS0FCTUFCLy8vQUE4QUFRQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBPT0pIGZvcm1hdCgnd29mZicpO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSB7XFxuICAtbXMtdGV4dC1zaXplLWFkanVzdDogMTAwJTtcXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjU7XFxuICBjb2xvcjogIzI0MjkyZTtcXG4gIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFxcXCJTZWdvZSBVSVxcXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYsIFxcXCJBcHBsZSBDb2xvciBFbW9qaVxcXCIsIFxcXCJTZWdvZSBVSSBFbW9qaVxcXCIsIFxcXCJTZWdvZSBVSSBTeW1ib2xcXFwiO1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgbGluZS1oZWlnaHQ6IDEuNTtcXG4gIHdvcmQtd3JhcDogYnJlYWstd29yZDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLnBsLWMge1xcbiAgY29sb3I6ICM2YTczN2Q7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC1jMSxcXG4ubWFya2Rvd24tYm9keSAucGwtcyAucGwtdiB7XFxuICBjb2xvcjogIzAwNWNjNTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLnBsLWUsXFxuLm1hcmtkb3duLWJvZHkgLnBsLWVuIHtcXG4gIGNvbG9yOiAjNmY0MmMxO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAucGwtc21pLFxcbi5tYXJrZG93bi1ib2R5IC5wbC1zIC5wbC1zMSB7XFxuICBjb2xvcjogIzI0MjkyZTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLnBsLWVudCB7XFxuICBjb2xvcjogIzIyODYzYTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLnBsLWsge1xcbiAgY29sb3I6ICNkNzNhNDk7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC1zLFxcbi5tYXJrZG93bi1ib2R5IC5wbC1wZHMsXFxuLm1hcmtkb3duLWJvZHkgLnBsLXMgLnBsLXBzZSAucGwtczEsXFxuLm1hcmtkb3duLWJvZHkgLnBsLXNyLFxcbi5tYXJrZG93bi1ib2R5IC5wbC1zciAucGwtY2NlLFxcbi5tYXJrZG93bi1ib2R5IC5wbC1zciAucGwtc3JlLFxcbi5tYXJrZG93bi1ib2R5IC5wbC1zciAucGwtc3JhIHtcXG4gIGNvbG9yOiAjMDMyZjYyO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAucGwtdixcXG4ubWFya2Rvd24tYm9keSAucGwtc213IHtcXG4gIGNvbG9yOiAjZTM2MjA5O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAucGwtYnUge1xcbiAgY29sb3I6ICNiMzFkMjg7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC1paSB7XFxuICBjb2xvcjogI2ZhZmJmYztcXG4gIGJhY2tncm91bmQtY29sb3I6ICNiMzFkMjg7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC1jMiB7XFxuICBjb2xvcjogI2ZhZmJmYztcXG4gIGJhY2tncm91bmQtY29sb3I6ICNkNzNhNDk7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC1jMjo6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJeTVxcXCI7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC1zciAucGwtY2NlIHtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgY29sb3I6ICMyMjg2M2E7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC1tbCB7XFxuICBjb2xvcjogIzczNWMwZjtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLnBsLW1oLFxcbi5tYXJrZG93bi1ib2R5IC5wbC1taCAucGwtZW4sXFxuLm1hcmtkb3duLWJvZHkgLnBsLW1zIHtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgY29sb3I6ICMwMDVjYzU7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC1taSB7XFxuICBmb250LXN0eWxlOiBpdGFsaWM7XFxuICBjb2xvcjogIzI0MjkyZTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLnBsLW1iIHtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgY29sb3I6ICMyNDI5MmU7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC1tZCB7XFxuICBjb2xvcjogI2IzMWQyODtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmVlZjA7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC1taTEge1xcbiAgY29sb3I6ICMyMjg2M2E7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmZmY0O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAucGwtbWMge1xcbiAgY29sb3I6ICNlMzYyMDk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZlYmRhO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAucGwtbWkyIHtcXG4gIGNvbG9yOiAjZjZmOGZhO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwNWNjNTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLnBsLW1kciB7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGNvbG9yOiAjNmY0MmMxO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAucGwtYmEge1xcbiAgY29sb3I6ICM1ODYwNjk7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC1zZyB7XFxuICBjb2xvcjogIzk1OWRhNTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLnBsLWNvcmwge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XFxuICBjb2xvcjogIzAzMmY2MjtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLm9jdGljb24ge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgdmVydGljYWwtYWxpZ246IHRleHQtdG9wO1xcbiAgZmlsbDogY3VycmVudENvbG9yO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBhIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgLXdlYmtpdC10ZXh0LWRlY29yYXRpb24tc2tpcDogb2JqZWN0cztcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgYTphY3RpdmUsXFxuLm1hcmtkb3duLWJvZHkgYTpob3ZlciB7XFxuICBvdXRsaW5lLXdpZHRoOiAwO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBzdHJvbmcge1xcbiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IHN0cm9uZyB7XFxuICBmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBoMSB7XFxuICBmb250LXNpemU6IDJlbTtcXG4gIG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGltZyB7XFxuICBib3JkZXItc3R5bGU6IG5vbmU7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IHN2Zzpub3QoOnJvb3QpIHtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGNvZGUsXFxuLm1hcmtkb3duLWJvZHkga2JkLFxcbi5tYXJrZG93bi1ib2R5IHByZSB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7XFxuICBmb250LXNpemU6IDFlbTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgaHIge1xcbiAgLXdlYmtpdC1ib3gtc2l6aW5nOiBjb250ZW50LWJveDtcXG4gICAgICAgICAgYm94LXNpemluZzogY29udGVudC1ib3g7XFxuICBoZWlnaHQ6IDA7XFxuICBvdmVyZmxvdzogdmlzaWJsZTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgaW5wdXQge1xcbiAgZm9udDogaW5oZXJpdDtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgaW5wdXQge1xcbiAgb3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IFt0eXBlPVxcXCJjaGVja2JveFxcXCJdIHtcXG4gIC13ZWJraXQtYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5ICoge1xcbiAgLXdlYmtpdC1ib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBpbnB1dCB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcXG4gIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBhIHtcXG4gIGNvbG9yOiAjMDM2NmQ2O1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBhOmhvdmVyIHtcXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBzdHJvbmcge1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgaHIge1xcbiAgaGVpZ2h0OiAwO1xcbiAgbWFyZ2luOiAxNXB4IDA7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXI6IDA7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2RmZTJlNTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgaHI6OmJlZm9yZSB7XFxuICBkaXNwbGF5OiB0YWJsZTtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBocjo6YWZ0ZXIge1xcbiAgZGlzcGxheTogdGFibGU7XFxuICBjbGVhcjogYm90aDtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSB0YWJsZSB7XFxuICBib3JkZXItc3BhY2luZzogMDtcXG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IHRkLFxcbi5tYXJrZG93bi1ib2R5IHRoIHtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGgxLFxcbi5tYXJrZG93bi1ib2R5IGgyLFxcbi5tYXJrZG93bi1ib2R5IGgzLFxcbi5tYXJrZG93bi1ib2R5IGg0LFxcbi5tYXJrZG93bi1ib2R5IGg1LFxcbi5tYXJrZG93bi1ib2R5IGg2IHtcXG4gIG1hcmdpbi10b3A6IDA7XFxuICBtYXJnaW4tYm90dG9tOiAwO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBoMSB7XFxuICBmb250LXNpemU6IDMycHg7XFxuICBmb250LXdlaWdodDogNjAwO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBoMiB7XFxuICBmb250LXNpemU6IDI0cHg7XFxuICBmb250LXdlaWdodDogNjAwO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBoMyB7XFxuICBmb250LXNpemU6IDIwcHg7XFxuICBmb250LXdlaWdodDogNjAwO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBoNCB7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICBmb250LXdlaWdodDogNjAwO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBoNSB7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBmb250LXdlaWdodDogNjAwO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBoNiB7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBmb250LXdlaWdodDogNjAwO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBwIHtcXG4gIG1hcmdpbi10b3A6IDA7XFxuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBibG9ja3F1b3RlIHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgdWwsXFxuLm1hcmtkb3duLWJvZHkgb2wge1xcbiAgcGFkZGluZy1sZWZ0OiAwO1xcbiAgbWFyZ2luLXRvcDogMDtcXG4gIG1hcmdpbi1ib3R0b206IDA7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IG9sIG9sLFxcbi5tYXJrZG93bi1ib2R5IHVsIG9sIHtcXG4gIGxpc3Qtc3R5bGUtdHlwZTogbG93ZXItcm9tYW47XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IHVsIHVsIG9sLFxcbi5tYXJrZG93bi1ib2R5IHVsIG9sIG9sLFxcbi5tYXJrZG93bi1ib2R5IG9sIHVsIG9sLFxcbi5tYXJrZG93bi1ib2R5IG9sIG9sIG9sIHtcXG4gIGxpc3Qtc3R5bGUtdHlwZTogbG93ZXItYWxwaGE7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGRkIHtcXG4gIG1hcmdpbi1sZWZ0OiAwO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBjb2RlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiU0ZNb25vLVJlZ3VsYXJcXFwiLCBDb25zb2xhcywgXFxcIkxpYmVyYXRpb24gTW9ub1xcXCIsIE1lbmxvLCBDb3VyaWVyLCBtb25vc3BhY2U7XFxuICBmb250LXNpemU6IDEycHg7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IHByZSB7XFxuICBtYXJnaW4tdG9wOiAwO1xcbiAgbWFyZ2luLWJvdHRvbTogMDtcXG4gIGZvbnQ6IDEycHggXFxcIlNGTW9uby1SZWd1bGFyXFxcIiwgQ29uc29sYXMsIFxcXCJMaWJlcmF0aW9uIE1vbm9cXFwiLCBNZW5sbywgQ291cmllciwgbW9ub3NwYWNlO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAub2N0aWNvbiB7XFxuICB2ZXJ0aWNhbC1hbGlnbjogdGV4dC1ib3R0b207XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC0wIHtcXG4gIHBhZGRpbmctbGVmdDogMCAhaW1wb3J0YW50O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAucGwtMSB7XFxuICBwYWRkaW5nLWxlZnQ6IDRweCAhaW1wb3J0YW50O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAucGwtMiB7XFxuICBwYWRkaW5nLWxlZnQ6IDhweCAhaW1wb3J0YW50O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAucGwtMyB7XFxuICBwYWRkaW5nLWxlZnQ6IDE2cHggIWltcG9ydGFudDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLnBsLTQge1xcbiAgcGFkZGluZy1sZWZ0OiAyNHB4ICFpbXBvcnRhbnQ7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5wbC01IHtcXG4gIHBhZGRpbmctbGVmdDogMzJweCAhaW1wb3J0YW50O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAucGwtNiB7XFxuICBwYWRkaW5nLWxlZnQ6IDQwcHggIWltcG9ydGFudDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHk6OmJlZm9yZSB7XFxuICBkaXNwbGF5OiB0YWJsZTtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keTo6YWZ0ZXIge1xcbiAgZGlzcGxheTogdGFibGU7XFxuICBjbGVhcjogYm90aDtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keT4qOmZpcnN0LWNoaWxkIHtcXG4gIG1hcmdpbi10b3A6IDAgIWltcG9ydGFudDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHk+KjpsYXN0LWNoaWxkIHtcXG4gIG1hcmdpbi1ib3R0b206IDAgIWltcG9ydGFudDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgYTpub3QoW2hyZWZdKSB7XFxuICBjb2xvcjogaW5oZXJpdDtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLmFuY2hvciB7XFxuICBmbG9hdDogbGVmdDtcXG4gIHBhZGRpbmctcmlnaHQ6IDRweDtcXG4gIG1hcmdpbi1sZWZ0OiAtMjBweDtcXG4gIGxpbmUtaGVpZ2h0OiAxO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSAuYW5jaG9yOmZvY3VzIHtcXG4gIG91dGxpbmU6IG5vbmU7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IHAsXFxuLm1hcmtkb3duLWJvZHkgYmxvY2txdW90ZSxcXG4ubWFya2Rvd24tYm9keSB1bCxcXG4ubWFya2Rvd24tYm9keSBvbCxcXG4ubWFya2Rvd24tYm9keSBkbCxcXG4ubWFya2Rvd24tYm9keSB0YWJsZSxcXG4ubWFya2Rvd24tYm9keSBwcmUge1xcbiAgbWFyZ2luLXRvcDogMDtcXG4gIG1hcmdpbi1ib3R0b206IDE2cHg7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGhyIHtcXG4gIGhlaWdodDogMC4yNWVtO1xcbiAgcGFkZGluZzogMDtcXG4gIG1hcmdpbjogMjRweCAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2UxZTRlODtcXG4gIGJvcmRlcjogMDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgYmxvY2txdW90ZSB7XFxuICBwYWRkaW5nOiAwIDFlbTtcXG4gIGNvbG9yOiAjNmE3MzdkO1xcbiAgYm9yZGVyLWxlZnQ6IDAuMjVlbSBzb2xpZCAjZGZlMmU1O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBibG9ja3F1b3RlPjpmaXJzdC1jaGlsZCB7XFxuICBtYXJnaW4tdG9wOiAwO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBibG9ja3F1b3RlPjpsYXN0LWNoaWxkIHtcXG4gIG1hcmdpbi1ib3R0b206IDA7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGtiZCB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBwYWRkaW5nOiAzcHggNXB4O1xcbiAgZm9udC1zaXplOiAxMXB4O1xcbiAgbGluZS1oZWlnaHQ6IDEwcHg7XFxuICBjb2xvcjogIzQ0NGQ1NjtcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmFmYmZjO1xcbiAgYm9yZGVyOiBzb2xpZCAxcHggI2M2Y2JkMTtcXG4gIGJvcmRlci1ib3R0b20tY29sb3I6ICM5NTlkYTU7XFxuICBib3JkZXItcmFkaXVzOiAzcHg7XFxuICAtd2Via2l0LWJveC1zaGFkb3c6IGluc2V0IDAgLTFweCAwICM5NTlkYTU7XFxuICAgICAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgLTFweCAwICM5NTlkYTU7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGgxLFxcbi5tYXJrZG93bi1ib2R5IGgyLFxcbi5tYXJrZG93bi1ib2R5IGgzLFxcbi5tYXJrZG93bi1ib2R5IGg0LFxcbi5tYXJrZG93bi1ib2R5IGg1LFxcbi5tYXJrZG93bi1ib2R5IGg2IHtcXG4gIG1hcmdpbi10b3A6IDI0cHg7XFxuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIGxpbmUtaGVpZ2h0OiAxLjI1O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBoMSAub2N0aWNvbi1saW5rLFxcbi5tYXJrZG93bi1ib2R5IGgyIC5vY3RpY29uLWxpbmssXFxuLm1hcmtkb3duLWJvZHkgaDMgLm9jdGljb24tbGluayxcXG4ubWFya2Rvd24tYm9keSBoNCAub2N0aWNvbi1saW5rLFxcbi5tYXJrZG93bi1ib2R5IGg1IC5vY3RpY29uLWxpbmssXFxuLm1hcmtkb3duLWJvZHkgaDYgLm9jdGljb24tbGluayB7XFxuICBjb2xvcjogIzFiMWYyMztcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxuICB2aXNpYmlsaXR5OiBoaWRkZW47XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGgxOmhvdmVyIC5hbmNob3IsXFxuLm1hcmtkb3duLWJvZHkgaDI6aG92ZXIgLmFuY2hvcixcXG4ubWFya2Rvd24tYm9keSBoMzpob3ZlciAuYW5jaG9yLFxcbi5tYXJrZG93bi1ib2R5IGg0OmhvdmVyIC5hbmNob3IsXFxuLm1hcmtkb3duLWJvZHkgaDU6aG92ZXIgLmFuY2hvcixcXG4ubWFya2Rvd24tYm9keSBoNjpob3ZlciAuYW5jaG9yIHtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgaDE6aG92ZXIgLmFuY2hvciAub2N0aWNvbi1saW5rLFxcbi5tYXJrZG93bi1ib2R5IGgyOmhvdmVyIC5hbmNob3IgLm9jdGljb24tbGluayxcXG4ubWFya2Rvd24tYm9keSBoMzpob3ZlciAuYW5jaG9yIC5vY3RpY29uLWxpbmssXFxuLm1hcmtkb3duLWJvZHkgaDQ6aG92ZXIgLmFuY2hvciAub2N0aWNvbi1saW5rLFxcbi5tYXJrZG93bi1ib2R5IGg1OmhvdmVyIC5hbmNob3IgLm9jdGljb24tbGluayxcXG4ubWFya2Rvd24tYm9keSBoNjpob3ZlciAuYW5jaG9yIC5vY3RpY29uLWxpbmsge1xcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgaDEge1xcbiAgcGFkZGluZy1ib3R0b206IDAuM2VtO1xcbiAgZm9udC1zaXplOiAyZW07XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2VhZWNlZjtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgaDIge1xcbiAgcGFkZGluZy1ib3R0b206IDAuM2VtO1xcbiAgZm9udC1zaXplOiAxLjVlbTtcXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZWFlY2VmO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBoMyB7XFxuICBmb250LXNpemU6IDEuMjVlbTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgaDQge1xcbiAgZm9udC1zaXplOiAxZW07XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGg1IHtcXG4gIGZvbnQtc2l6ZTogMC44NzVlbTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgaDYge1xcbiAgZm9udC1zaXplOiAwLjg1ZW07XFxuICBjb2xvcjogIzZhNzM3ZDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgdWwsXFxuLm1hcmtkb3duLWJvZHkgb2wge1xcbiAgcGFkZGluZy1sZWZ0OiAyZW07XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IHVsIHVsLFxcbi5tYXJrZG93bi1ib2R5IHVsIG9sLFxcbi5tYXJrZG93bi1ib2R5IG9sIG9sLFxcbi5tYXJrZG93bi1ib2R5IG9sIHVsIHtcXG4gIG1hcmdpbi10b3A6IDA7XFxuICBtYXJnaW4tYm90dG9tOiAwO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBsaT5wIHtcXG4gIG1hcmdpbi10b3A6IDE2cHg7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGxpK2xpIHtcXG4gIG1hcmdpbi10b3A6IDAuMjVlbTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgZGwge1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgZGwgZHQge1xcbiAgcGFkZGluZzogMDtcXG4gIG1hcmdpbi10b3A6IDE2cHg7XFxuICBmb250LXNpemU6IDFlbTtcXG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGRsIGRkIHtcXG4gIHBhZGRpbmc6IDAgMTZweDtcXG4gIG1hcmdpbi1ib3R0b206IDE2cHg7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IHRhYmxlIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBvdmVyZmxvdzogYXV0bztcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgdGFibGUgdGgge1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgdGFibGUgdGgsXFxuLm1hcmtkb3duLWJvZHkgdGFibGUgdGQge1xcbiAgcGFkZGluZzogNnB4IDEzcHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZGZlMmU1O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSB0YWJsZSB0ciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNjNmNiZDE7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IHRhYmxlIHRyOm50aC1jaGlsZCgybikge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y2ZjhmYTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgaW1nIHtcXG4gIG1heC13aWR0aDogMTAwJTtcXG4gIC13ZWJraXQtYm94LXNpemluZzogY29udGVudC1ib3g7XFxuICAgICAgICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgY29kZSB7XFxuICBwYWRkaW5nOiAwO1xcbiAgcGFkZGluZy10b3A6IDAuMmVtO1xcbiAgcGFkZGluZy1ib3R0b206IDAuMmVtO1xcbiAgbWFyZ2luOiAwO1xcbiAgZm9udC1zaXplOiA4NSU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI3LDMxLDM1LDAuMDUpO1xcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBjb2RlOjpiZWZvcmUsXFxuLm1hcmtkb3duLWJvZHkgY29kZTo6YWZ0ZXIge1xcbiAgbGV0dGVyLXNwYWNpbmc6IC0wLjJlbTtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcQTBcXFwiO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBwcmUge1xcbiAgd29yZC13cmFwOiBub3JtYWw7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IHByZT5jb2RlIHtcXG4gIHBhZGRpbmc6IDA7XFxuICBtYXJnaW46IDA7XFxuICBmb250LXNpemU6IDEwMCU7XFxuICB3b3JkLWJyZWFrOiBub3JtYWw7XFxuICB3aGl0ZS1zcGFjZTogcHJlO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXI6IDA7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC5oaWdobGlnaHQge1xcbiAgbWFyZ2luLWJvdHRvbTogMTZweDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLmhpZ2hsaWdodCBwcmUge1xcbiAgbWFyZ2luLWJvdHRvbTogMDtcXG4gIHdvcmQtYnJlYWs6IG5vcm1hbDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLmhpZ2hsaWdodCBwcmUsXFxuLm1hcmtkb3duLWJvZHkgcHJlIHtcXG4gIHBhZGRpbmc6IDE2cHg7XFxuICBvdmVyZmxvdzogYXV0bztcXG4gIGZvbnQtc2l6ZTogODUlO1xcbiAgbGluZS1oZWlnaHQ6IDEuNDU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjZmOGZhO1xcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSBwcmUgY29kZSB7XFxuICBkaXNwbGF5OiBpbmxpbmU7XFxuICBtYXgtd2lkdGg6IGF1dG87XFxuICBwYWRkaW5nOiAwO1xcbiAgbWFyZ2luOiAwO1xcbiAgb3ZlcmZsb3c6IHZpc2libGU7XFxuICBsaW5lLWhlaWdodDogaW5oZXJpdDtcXG4gIHdvcmQtd3JhcDogbm9ybWFsO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXI6IDA7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IHByZSBjb2RlOjpiZWZvcmUsXFxuLm1hcmtkb3duLWJvZHkgcHJlIGNvZGU6OmFmdGVyIHtcXG4gIGNvbnRlbnQ6IG5vcm1hbDtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLmZ1bGwtY29tbWl0IC5idG4tb3V0bGluZTpub3QoOmRpc2FibGVkKTpob3ZlciB7XFxuICBjb2xvcjogIzAwNWNjNTtcXG4gIGJvcmRlci1jb2xvcjogIzAwNWNjNTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkga2JkIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHBhZGRpbmc6IDNweCA1cHg7XFxuICBmb250OiAxMXB4IFxcXCJTRk1vbm8tUmVndWxhclxcXCIsIENvbnNvbGFzLCBcXFwiTGliZXJhdGlvbiBNb25vXFxcIiwgTWVubG8sIENvdXJpZXIsIG1vbm9zcGFjZTtcXG4gIGxpbmUtaGVpZ2h0OiAxMHB4O1xcbiAgY29sb3I6ICM0NDRkNTY7XFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZhZmJmYztcXG4gIGJvcmRlcjogc29saWQgMXB4ICNkMWQ1ZGE7XFxuICBib3JkZXItYm90dG9tLWNvbG9yOiAjYzZjYmQxO1xcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xcbiAgLXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIC0xcHggMCAjYzZjYmQxO1xcbiAgICAgICAgICBib3gtc2hhZG93OiBpbnNldCAwIC0xcHggMCAjYzZjYmQxO1xcbn1cXG5cXG4ubWFya2Rvd24tYm9keSA6Y2hlY2tlZCsucmFkaW8tbGFiZWwge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgei1pbmRleDogMTtcXG4gIGJvcmRlci1jb2xvcjogIzAzNjZkNjtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLnRhc2stbGlzdC1pdGVtIHtcXG4gIGxpc3Qtc3R5bGUtdHlwZTogbm9uZTtcXG59XFxuXFxuLm1hcmtkb3duLWJvZHkgLnRhc2stbGlzdC1pdGVtKy50YXNrLWxpc3QtaXRlbSB7XFxuICBtYXJnaW4tdG9wOiAzcHg7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IC50YXNrLWxpc3QtaXRlbSBpbnB1dCB7XFxuICBtYXJnaW46IDAgMC4yZW0gMC4yNWVtIC0xLjZlbTtcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxufVxcblxcbi5tYXJrZG93bi1ib2R5IGhyIHtcXG4gIGJvcmRlci1ib3R0b20tY29sb3I6ICNlZWU7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyP3tcIm1vZHVsZXNcIjpmYWxzZX0hLi9+L3Bvc3Rjc3MtbG9hZGVyL2xpYj97fSEuL34vZ2l0aHViLW1hcmtkb3duLWNzcy9naXRodWItbWFya2Rvd24uY3NzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIudG9waWMtY3JlYXRlIC5pdGVtIHtcXG4gIHBhZGRpbmc6IDEwcHggMTBweDtcXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZWVlO1xcbiAgY29sb3I6ICM0NDQ7XFxufVxcbi50b3BpYy1jcmVhdGUgLmtleSB7XFxuICB3aWR0aDogNDBweDtcXG4gIGxpbmUtaGVpZ2h0OiAyOHB4O1xcbiAgZm9udC1zaXplOiAxNHB4O1xcbiAgY29sb3I6ICM5OTk7XFxufVxcbi50b3BpYy1jcmVhdGUgc2VsZWN0IHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgLXdlYmtpdC1ib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDI4cHg7XFxuICBsaW5lLWhlaWdodDogMjhweDtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGZvbnQtc2l6ZTogMTNweDtcXG4gIGNvbG9yOiAjMjIyO1xcbn1cXG4udG9waWMtY3JlYXRlIGlucHV0IHtcXG4gIC13ZWJraXQtYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgbGluZS1oZWlnaHQ6IDI4cHg7XFxuICBmb250LXNpemU6IDEzcHg7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxufVxcbi50b3BpYy1jcmVhdGUgdGV4dGFyZWEge1xcbiAgLXdlYmtpdC1ib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDMwMHB4O1xcbiAgbGluZS1oZWlnaHQ6IDI0cHg7XFxuICBmb250LXNpemU6IDEzcHg7XFxuICByZXNpemU6IG5vbmU7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyP3tcIm1vZHVsZXNcIjpmYWxzZX0hLi9+L3Bvc3Rjc3MtbG9hZGVyL2xpYj97fSEuL34vbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zcmMvcGFnZXMvY3JlYXRlL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5pbmRleC1saXN0IHtcXG4gIG92ZXJmbG93OiBhdXRvO1xcbiAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAzOHB4O1xcbiAgYm90dG9tOiA0MHB4O1xcbiAgbGVmdDogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogI2ZmZjtcXG4gIGNvbG9yOiAjY2NjO1xcbn1cXG4uaW5kZXgtbGlzdCBsaSB7XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XFxuICBmb250LXNpemU6IDA7XFxufVxcbi5pbmRleC1saXN0IC50aXQge1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIGhlaWdodDogMjhweDtcXG4gIGxpbmUtaGVpZ2h0OiAyOHB4O1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcbiAgY29sb3I6ICM2NjY7XFxufVxcbi5pbmRleC1saXN0IC5hdXRob3Ige1xcbiAgcGFkZGluZy1yaWdodDogNXB4O1xcbn1cXG4uaW5kZXgtbGlzdCAuY29uIHtcXG4gIGxpbmUtaGVpZ2h0OiAyMHB4O1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgY29sb3I6ICM2NjY7XFxufVxcbi5pbmRleC1saXN0IHRpbWUge1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbn1cXG4uaW5kZXgtbGlzdCAuYm90dG9tIHtcXG4gIG1hcmdpbi10b3A6IDVweDtcXG59XFxuLmluZGV4LWxpc3QgLnVzZXItaGVhZGltZyB7XFxuICB3aWR0aDogNDBweDtcXG4gIGhlaWdodDogNDBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbn1cXG4uaW5kZXgtbGlzdCAuZm9udCAuaWNvbmZvbnQge1xcbiAgcGFkZGluZzogM3B4IDVweDtcXG4gIG1hcmdpbi1yaWdodDogNXB4O1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgY29sb3I6ICNmZmY7XFxufVxcbi50b3BOYXYge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYmFja2dyb3VuZDogIzgwYmQwMTtcXG4gIGNvbG9yOiAjZWVlO1xcbiAgaGVpZ2h0OiAzOHB4O1xcbiAgbGluZS1oZWlnaHQ6IDM4cHg7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgcmlnaHQ6IDA7XFxufVxcbi50b3BOYXYgYSB7XFxuICBjb2xvcjogI2VlZTtcXG4gIHBhZGRpbmc6IDNweCAxMHB4O1xcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xcbn1cXG4udG9wTmF2IC5vbiBhIHtcXG4gIGJhY2tncm91bmQ6ICM1ZThhMDE7XFxufVxcbi5uYXYge1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgYm90dG9tOiAwO1xcbiAgbGVmdDogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgaGVpZ2h0OiA0MHB4O1xcbiAgbGluZS1oZWlnaHQ6IDQwcHg7XFxuICBiYWNrZ3JvdW5kOiAjODBiZDAxO1xcbn1cXG4ubmF2IGEge1xcbiAgY29sb3I6ICNlZWU7XFxufVxcbi5hY3RpdmUge1xcbiAgYmFja2dyb3VuZDogI2EyZjAwMTtcXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXI/e1wibW9kdWxlc1wiOmZhbHNlfSEuL34vcG9zdGNzcy1sb2FkZXIvbGliP3t9IS4vfi9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3NyYy9wYWdlcy9ob21lL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi8qXFxuICAgIOeUqOaIt+WktOWDj1xcbiovXFxuLnVzZXItaGVhZGltZyB7XFxuICB3aWR0aDogMzhweDtcXG4gIGhlaWdodDogMzhweDtcXG4gIG1hcmdpbi1yaWdodDogMTBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VlZTtcXG59XFxuLypcXG4gICAg55m75b2VXFxuKi9cXG4uc2lnbmluIHtcXG4gIGhlaWdodDogNDgwcHg7XFxufVxcbi5zaWduaW4gLmNlbnRlciB7XFxuICB3aWR0aDogMjgwcHg7XFxufVxcbi5zaWduaW4gLnRleHQge1xcbiAgbWFyZ2luLWJvdHRvbTogMzBweDtcXG59XFxuLnNpZ25pbiAudGV4dCBpbnB1dCB7XFxuICAtd2Via2l0LWJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICB3aWR0aDogMTAwJTtcXG4gIHBhZGRpbmc6IDVweCAxMHB4O1xcbiAgbGluZS1oZWlnaHQ6IDI4cHg7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZWVlO1xcbiAgZm9udC1zaXplOiAxM3B4O1xcbn1cXG4uc2lnbmluIC5idG4ge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICB3aWR0aDogMTAwJTtcXG4gIHBhZGRpbmc6IDVweCAxMHB4O1xcbiAgbGluZS1oZWlnaHQ6IDI4cHg7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LXNpemU6IDEzcHg7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGJhY2tncm91bmQ6ICM4MGJkMDE7XFxufVxcbi5zaWduaW4gLmxvZ2lub3V0IHtcXG4gIGJhY2tncm91bmQ6ICNlNjNlM2U7XFxufVxcbi5zaWduaW4gLmJ0bi1yZWQge1xcbiAgYmFja2dyb3VuZDogI2U2M2UzZTtcXG59XFxuLypcXG4gICAg5Liq5Lq65Lit5b+DXFxuKi9cXG4udXNlci1pbmRleCAuaGVhZGltZyB7XFxuICBwYWRkaW5nOiAyMHB4O1xcbiAgYmFja2dyb3VuZDogIzg3YzcwMTtcXG59XFxuLnVzZXItaW5kZXggLmhlYWRpbWcgLnVzZXItaGVhZGltZyB7XFxuICB3aWR0aDogODBweDtcXG4gIGhlaWdodDogODBweDtcXG59XFxuLnVzZXItaW5kZXggLm5hbWUge1xcbiAgcGFkZGluZy10b3A6IDEwcHg7XFxuICBsaW5lLWhlaWdodDogMjRweDtcXG4gIGZvbnQtc2l6ZTogMTZweDtcXG4gIGNvbG9yOiAjZmZmO1xcbn1cXG4udXNlci1pbmRleCAuc2NvcmUge1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgY29sb3I6ICNlZWU7XFxufVxcbi51c2VyLWluZGV4IC50YWItbmF2IHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGJhY2tncm91bmQ6ICNlZWU7XFxufVxcbi51c2VyLWluZGV4IC50YWItbmF2IGxpIHtcXG4gIGxpbmUtaGVpZ2h0OiAzOHB4O1xcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkIHRyYW5zcGFyZW50O1xcbn1cXG4udXNlci1pbmRleCAudGFiLW5hdiAub24ge1xcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICM4MGJkMDE7XFxufVxcbi51c2VyLWluZGV4IC5saXN0IHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbi51c2VyLWluZGV4IC5saXN0IGEge1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIGhlaWdodDogMjhweDtcXG4gIHBhZGRpbmc6IDVweCAxMHB4O1xcbiAgbGluZS1oZWlnaHQ6IDI4cHg7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2VlZTtcXG59XFxuLnVzZXItaW5kZXggLmxpc3QgYSAudGl0IHtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcXG59XFxuLnVzZXItaW5kZXggLmxpc3QgYSB0aW1lIHtcXG4gIHBhZGRpbmctbGVmdDogMjBweDtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIGNvbG9yOiAjYWFhO1xcbn1cXG4vKlxcbiAgICDmiJHnmoTmtojmga9cXG4qL1xcbi5tc2ctYm94IC5saXN0IGxpIHtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2VlZTtcXG59XFxuLm1zZy1ib3ggLmxpc3QgbGkgYSB7XFxuICBjb2xvcjogIzgwYmQwMTtcXG59XFxuLm1zZy1ib3ggLmxpc3QgbGkgLm5hbWUge1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBsaW5lLWhlaWdodDogMjhweDtcXG59XFxuLm1zZy1ib3ggLmxpc3QgbGkgLm5hbWUgdGltZSB7XFxuICBwYWRkaW5nLWxlZnQ6IDVweDtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XFxuICBjb2xvcjogIzk5OTtcXG59XFxuLm1zZy1ib3ggLmxpc3QgbGkgLmNvbnRlbnQge1xcbiAgcGFkZGluZzogNXB4IDA7XFxufVxcbi5tc2ctYm94IC5saXN0IGxpIC5kaWFuLXRydWUge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuLm1zZy1ib3ggLmxpc3QgbGkgLmRpYW4tZmFsc2Uge1xcbiAgd2lkdGg6IDhweDtcXG4gIGhlaWdodDogOHB4O1xcbiAgbWFyZ2luLXJpZ2h0OiA1cHg7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBiYWNrZ3JvdW5kOiByZWQ7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyP3tcIm1vZHVsZXNcIjpmYWxzZX0hLi9+L3Bvc3Rjc3MtbG9hZGVyL2xpYj97fSEuL34vbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zcmMvcGFnZXMvbG9naW4vaW5kZXgubGVzc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmFydGljbGUge1xcbiAgbWFyZ2luLXRvcDogNjBweDtcXG59XFxuLnRvcGljIC51c2VyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICBsaW5lLWhlaWdodDogMjBweDtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1xcbn1cXG4udG9waWMgLnVzZXIgLnVzZXItaGVhZGltZyB7XFxuICB3aWR0aDogNDBweDtcXG4gIGhlaWdodDogNDBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxufVxcbi50b3BpYyAudXNlciAubmFtZSB7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBjb2xvcjogIzgwYmQwMTtcXG59XFxuLnRvcGljIC51c2VyIC5sb3Uge1xcbiAgbGluZS1oZWlnaHQ6IDE0cHg7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBjb2xvcjogI2FhYTtcXG59XFxuLnRvcGljIC51c2VyIHRpbWUge1xcbiAgcGFkZGluZy1sZWZ0OiA1cHg7XFxuICBsaW5lLWhlaWdodDogMTRweDtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGNvbG9yOiAjNjY2O1xcbn1cXG4udG9waWMgLnVzZXIgLnF0IGRpdiB7XFxuICBwYWRkaW5nLXJpZ2h0OiA1cHg7XFxufVxcbi50b3BpYyAudXNlciAuZm9udCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICByaWdodDogMDtcXG59XFxuLnRvcGljIC51c2VyIC5mb250IC5pY29uZm9udCB7XFxuICB3aWR0aDogNjBweDtcXG4gIGhlaWdodDogNjBweDtcXG4gIGxpbmUtaGVpZ2h0OiA2MHB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1zaXplOiAzMnB4O1xcbiAgY29sb3I6ICNmZmY7XFxuICBvcGFjaXR5OiAwLjg7XFxufVxcbi50b3BpYyAudGl0MiB7XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgZm9udC1zaXplOiAxOHB4O1xcbiAgYmFja2dyb3VuZDogI2VlZTtcXG59XFxuLnRvcGljIC5jb250ZW50IHtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgbGluZS1oZWlnaHQ6IDI0cHg7XFxuICBmb250LXNpemU6IDEzcHg7XFxufVxcbi50b3BpYyAudGl0MyB7XFxuICBwYWRkaW5nOiA1cHggMTBweDtcXG4gIGxpbmUtaGVpZ2h0OiAyNHB4O1xcbiAgYm9yZGVyLWxlZnQ6IDhweCBzb2xpZCAjODBiZDAxO1xcbiAgYmFja2dyb3VuZDogI2VlZTtcXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XFxuICBmb250LXNpemU6IDE0cHg7XFxufVxcbi50b3BpYyAudGl0MyBlbSB7XFxuICBmb250LXN0eWxlOiBub3JtYWw7XFxuICBjb2xvcjogIzgwYmQwMTtcXG59XFxuLnJlLWxpc3Qge1xcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcXG59XFxuLnJlLWxpc3QgbGkge1xcbiAgcGFkZGluZzogMTBweCAxMHB4IDAgMTBweDtcXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1xcbn1cXG4ucmUtbGlzdCBsaSAudXNlci1oZWFkaW1nIHtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgaGVpZ2h0OiA0MHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXG59XFxuLnJlLWxpc3QgbGkgLm5hbWUge1xcbiAgZm9udC1zaXplOiAxNHB4O1xcbiAgY29sb3I6ICM4MGJkMDE7XFxufVxcbi5yZS1saXN0IGxpIC5sb3Uge1xcbiAgbGluZS1oZWlnaHQ6IDE0cHg7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBjb2xvcjogI2FhYTtcXG59XFxuLnJlLWxpc3QgbGkgdGltZSB7XFxuICBwYWRkaW5nLWxlZnQ6IDVweDtcXG4gIGxpbmUtaGVpZ2h0OiAxNHB4O1xcbiAgZm9udC1zaXplOiAxNHB4O1xcbiAgY29sb3I6ICM2NjY7XFxufVxcbi5yZS1saXN0IGxpIC5ib3R0b20gLmZvbnQge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgcGFkZGluZzogMTBweDtcXG59XFxuLnJlLWxpc3QgbGkgLmJvdHRvbSAuZm9udCBlbSB7XFxuICBmb250LXNpemU6IDEzcHg7XFxuICBmb250LXN0eWxlOiBub3JtYWw7XFxufVxcbi5yZS1saXN0IGxpIC5ib3R0b20gLmZvbnQtdHJ1ZSB7XFxuICBjb2xvcjogIzgwYmQwMTtcXG59XFxuLnJlLWxpc3QgYSB7XFxuICBjb2xvcjogIzgwYmQwMTtcXG59XFxuLnJlcGx5LWJveCB7XFxuICBwYWRkaW5nOiAxMHB4O1xcbn1cXG4ucmVwbHktYm94IC50ZXh0IHtcXG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XFxufVxcbi5yZXBseS1ib3ggLnRleHQgdGV4dGFyZWEge1xcbiAgLXdlYmtpdC1ib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEyMHB4O1xcbiAgcGFkZGluZzogMTBweDtcXG4gIGxpbmUtaGVpZ2h0OiAyNHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcXG4gIGZvbnQtc2l6ZTogMTNweDtcXG4gIHJlc2l6ZTogbm9uZTtcXG59XFxuLnJlcGx5LWJveCAuYnRuIHtcXG4gIHBhZGRpbmc6IDVweCAzMHB4O1xcbiAgbGluZS1oZWlnaHQ6IDI0cHg7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjNmZhNDAxO1xcbiAgZm9udC1zaXplOiAxNHB4O1xcbiAgY29sb3I6ICNmZmY7XFxuICBiYWNrZ3JvdW5kOiAjODBiZDAxO1xcbn1cXG4udGlwLW1zZy1zaWduaW4ge1xcbiAgcGFkZGluZzogMzBweCAzMHB4IDUwcHggMzBweDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuLnRpcC1tc2ctc2lnbmluIGEge1xcbiAgY29sb3I6ICM4MGJkMDE7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyP3tcIm1vZHVsZXNcIjpmYWxzZX0hLi9+L3Bvc3Rjc3MtbG9hZGVyL2xpYj97fSEuL34vbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zcmMvcGFnZXMvdG9waWMvaW5kZXgubGVzc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLypcXG4gICAg55So5oi35aS05YOPXFxuKi9cXG4udXNlci1oZWFkaW1nIHtcXG4gIHdpZHRoOiAzOHB4O1xcbiAgaGVpZ2h0OiAzOHB4O1xcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcXG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWVlO1xcbn1cXG4vKlxcbiAgICDnmbvlvZVcXG4qL1xcbi5zaWduaW4ge1xcbiAgaGVpZ2h0OiA0ODBweDtcXG59XFxuLnNpZ25pbiAuY2VudGVyIHtcXG4gIHdpZHRoOiAyODBweDtcXG59XFxuLnNpZ25pbiAudGV4dCB7XFxuICBtYXJnaW4tYm90dG9tOiAzMHB4O1xcbn1cXG4uc2lnbmluIC50ZXh0IGlucHV0IHtcXG4gIC13ZWJraXQtYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgcGFkZGluZzogNXB4IDEwcHg7XFxuICBsaW5lLWhlaWdodDogMjhweDtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7XFxuICBmb250LXNpemU6IDEzcHg7XFxufVxcbi5zaWduaW4gLmJ0biB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHdpZHRoOiAxMDAlO1xcbiAgcGFkZGluZzogNXB4IDEwcHg7XFxuICBsaW5lLWhlaWdodDogMjhweDtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogMTNweDtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgYmFja2dyb3VuZDogIzgwYmQwMTtcXG59XFxuLnNpZ25pbiAuYnRuLXJlZCB7XFxuICBiYWNrZ3JvdW5kOiAjZTYzZTNlO1xcbn1cXG4udXNlci1pbmRleCAuaGVhZGltZyB7XFxuICBwYWRkaW5nOiAyMHB4O1xcbiAgYmFja2dyb3VuZDogIzg3YzcwMTtcXG59XFxuLnVzZXItaW5kZXggLmhlYWRpbWcgLnVzZXItaGVhZGltZyB7XFxuICB3aWR0aDogODBweDtcXG4gIGhlaWdodDogODBweDtcXG59XFxuLnVzZXItaW5kZXggLm5hbWUge1xcbiAgcGFkZGluZy10b3A6IDEwcHg7XFxuICBsaW5lLWhlaWdodDogMjRweDtcXG4gIGZvbnQtc2l6ZTogMTZweDtcXG4gIGNvbG9yOiAjZmZmO1xcbn1cXG4udXNlci1pbmRleCAuc2NvcmUge1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgY29sb3I6ICNlZWU7XFxufVxcbi51c2VyLWluZGV4IC50YWItbmF2IHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGJhY2tncm91bmQ6ICNlZWU7XFxufVxcbi51c2VyLWluZGV4IC50YWItbmF2IGxpIHtcXG4gIGxpbmUtaGVpZ2h0OiAzOHB4O1xcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkIHRyYW5zcGFyZW50O1xcbn1cXG4udXNlci1pbmRleCAudGFiLW5hdiAub24ge1xcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICM4MGJkMDE7XFxufVxcbi51c2VyLWluZGV4IC5saXN0IHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbi51c2VyLWluZGV4IC5saXN0IGEge1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIGhlaWdodDogMjhweDtcXG4gIHBhZGRpbmc6IDVweCAxMHB4O1xcbiAgbGluZS1oZWlnaHQ6IDI4cHg7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2VlZTtcXG59XFxuLnVzZXItaW5kZXggLmxpc3QgYSAudGl0IHtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcbi51c2VyLWluZGV4IC5saXN0IGEgdGltZSB7XFxuICBwYWRkaW5nLWxlZnQ6IDIwcHg7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBjb2xvcjogI2FhYTtcXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXI/e1wibW9kdWxlc1wiOmZhbHNlfSEuL34vcG9zdGNzcy1sb2FkZXIvbGliP3t9IS4vfi9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3NyYy9wYWdlcy91c2VyL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImEsXFxudWwsXFxuaSxcXG5wLFxcbmgzLFxcbmxpLFxcbmRpdiB7XFxuICBwYWRkaW5nOiAwO1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5hIHtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuLmljb24tdG9wIHtcXG4gIGJhY2tncm91bmQ6IHJlZDtcXG59XFxuLmljb24tZ29vZCB7XFxuICBiYWNrZ3JvdW5kOiBibHVlO1xcbn1cXG4uaWNvbi1zaGFyZSB7XFxuICBiYWNrZ3JvdW5kOiBncmVlbjtcXG59XFxuLmljb24tYXNrIHtcXG4gIGJhY2tncm91bmQ6IHBpbms7XFxufVxcbi5pY29uLWpvYiB7XFxuICBiYWNrZ3JvdW5kOiAjMDBCMzhBO1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlcj97XCJtb2R1bGVzXCI6ZmFsc2V9IS4vfi9wb3N0Y3NzLWxvYWRlci9saWI/e30hLi9+L2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3JjL3N0eWxlL3N0eWxlLmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLyohIG5vcm1hbGl6ZS5jc3MgdjcuMC4wIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xcblxcbi8qIERvY3VtZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpblxcbiAqICAgIElFIG9uIFdpbmRvd3MgUGhvbmUgYW5kIGluIGlPUy5cXG4gKi9cXG5cXG5odG1sIHtcXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICAtbXMtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxufVxcblxcbi8qIFNlY3Rpb25zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMgKG9waW5pb25hdGVkKS5cXG4gKi9cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgOS0uXFxuICovXFxuXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5mb290ZXIsXFxuaGVhZGVyLFxcbm5hdixcXG5zZWN0aW9uIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5oMSB7XFxuICBmb250LXNpemU6IDJlbTtcXG4gIG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFLlxcbiAqL1xcblxcbmZpZ2NhcHRpb24sXFxuZmlndXJlLFxcbm1haW4geyAvKiAxICovXFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IG1hcmdpbiBpbiBJRSA4LlxcbiAqL1xcblxcbmZpZ3VyZSB7XFxuICBtYXJnaW46IDFlbSA0MHB4O1xcbn1cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxcbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcbiAqL1xcblxcbmhyIHtcXG4gIC13ZWJraXQtYm94LXNpemluZzogY29udGVudC1ib3g7XFxuICAgICAgICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXFxuICBoZWlnaHQ6IDA7IC8qIDEgKi9cXG4gIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnByZSB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxufVxcblxcbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXFxuICogMi4gUmVtb3ZlIGdhcHMgaW4gbGlua3MgdW5kZXJsaW5lIGluIGlPUyA4KyBhbmQgU2FmYXJpIDgrLlxcbiAqL1xcblxcbmEge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7IC8qIDEgKi9cXG4gIC13ZWJraXQtdGV4dC1kZWNvcmF0aW9uLXNraXA6IG9iamVjdHM7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny0gYW5kIEZpcmVmb3ggMzktLlxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYWJiclt0aXRsZV0ge1xcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXG4gIC13ZWJraXQtdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkO1xcbiAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogUHJldmVudCB0aGUgZHVwbGljYXRlIGFwcGxpY2F0aW9uIG9mIGBib2xkZXJgIGJ5IHRoZSBuZXh0IHJ1bGUgaW4gU2FmYXJpIDYuXFxuICovXFxuXFxuYixcXG5zdHJvbmcge1xcbiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYixcXG5zdHJvbmcge1xcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuY29kZSxcXG5rYmQsXFxuc2FtcCB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHN0eWxlIGluIEFuZHJvaWQgNC4zLS5cXG4gKi9cXG5cXG5kZm4ge1xcbiAgZm9udC1zdHlsZTogaXRhbGljO1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgYmFja2dyb3VuZCBhbmQgY29sb3IgaW4gSUUgOS0uXFxuICovXFxuXFxubWFyayB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwO1xcbiAgY29sb3I6ICMwMDA7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnNtYWxsIHtcXG4gIGZvbnQtc2l6ZTogODAlO1xcbn1cXG5cXG4vKipcXG4gKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXG4gKiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc3ViLFxcbnN1cCB7XFxuICBmb250LXNpemU6IDc1JTtcXG4gIGxpbmUtaGVpZ2h0OiAwO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5zdWIge1xcbiAgYm90dG9tOiAtMC4yNWVtO1xcbn1cXG5cXG5zdXAge1xcbiAgdG9wOiAtMC41ZW07XFxufVxcblxcbi8qIEVtYmVkZGVkIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqL1xcblxcbmF1ZGlvLFxcbnZpZGVvIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gaU9TIDQtNy5cXG4gKi9cXG5cXG5hdWRpbzpub3QoW2NvbnRyb2xzXSkge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIGhlaWdodDogMDtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC0uXFxuICovXFxuXFxuaW1nIHtcXG4gIGJvcmRlci1zdHlsZTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogSGlkZSB0aGUgb3ZlcmZsb3cgaW4gSUUuXFxuICovXFxuXFxuc3ZnOm5vdCg6cm9vdCkge1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG59XFxuXFxuLyogRm9ybXNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzIChvcGluaW9uYXRlZCkuXFxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCxcXG5vcHRncm91cCxcXG5zZWxlY3QsXFxudGV4dGFyZWEge1xcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gIG1hcmdpbjogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCB7IC8qIDEgKi9cXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuICovXFxuXFxuYnV0dG9uLFxcbnNlbGVjdCB7IC8qIDEgKi9cXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBQcmV2ZW50IGEgV2ViS2l0IGJ1ZyB3aGVyZSAoMikgZGVzdHJveXMgbmF0aXZlIGBhdWRpb2AgYW5kIGB2aWRlb2BcXG4gKiAgICBjb250cm9scyBpbiBBbmRyb2lkIDQuXFxuICogMi4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5idXR0b24sXFxuaHRtbCBbdHlwZT1cXFwiYnV0dG9uXFxcIl0sIC8qIDEgKi9cXG5bdHlwZT1cXFwicmVzZXRcXFwiXSxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XFxuICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXFxuICovXFxuXFxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06LW1vei1mb2N1c3Jpbmcge1xcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICovXFxuXFxuZmllbGRzZXQge1xcbiAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxubGVnZW5kIHtcXG4gIC13ZWJraXQtYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG4gIGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXFxuICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cXG4gIHBhZGRpbmc6IDA7IC8qIDMgKi9cXG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cXG59XFxuXFxuLyoqXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgOS0uXFxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXG4gKi9cXG5cXG5wcm9ncmVzcyB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IC8qIDEgKi9cXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFLlxcbiAqL1xcblxcbnRleHRhcmVhIHtcXG4gIG92ZXJmbG93OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC0uXFxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG5bdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuICAtd2Via2l0LWJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gIHBhZGRpbmc6IDA7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxcbiAqL1xcblxcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcbiAgaGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl0ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG4gIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBhbmQgY2FuY2VsIGJ1dHRvbnMgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1jYW5jZWwtYnV0dG9uLFxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAqL1xcblxcbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cXG4gIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXG59XFxuXFxuLyogSW50ZXJhY3RpdmVcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgOS0uXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUsIGFuZCBGaXJlZm94LlxcbiAqL1xcblxcbmRldGFpbHMsIC8qIDEgKi9cXG5tZW51IHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdW1tYXJ5IHtcXG4gIGRpc3BsYXk6IGxpc3QtaXRlbTtcXG59XFxuXFxuLyogU2NyaXB0aW5nXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSA5LS5cXG4gKi9cXG5cXG5jYW52YXMge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRS5cXG4gKi9cXG5cXG50ZW1wbGF0ZSB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4vKiBIaWRkZW5cXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLS5cXG4gKi9cXG5cXG5baGlkZGVuXSB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlcj97XCJtb2R1bGVzXCI6ZmFsc2V9IS4vfi9wb3N0Y3NzLWxvYWRlci9saWI/e30hLi9+L25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXFxyXFxuQGZvbnQtZmFjZSB7Zm9udC1mYW1pbHk6ICdpY29uZm9udCc7XFxyXFxuICAgIHNyYzogdXJsKFwiICsgcmVxdWlyZShcIi4vaWNvbmZvbnQuZW90XCIpICsgXCIpOyAvKiBJRTkqL1xcclxcbiAgICBzcmM6IHVybChcIiArIHJlcXVpcmUoXCIuL2ljb25mb250LmVvdFwiKSArIFwiPyNpZWZpeCkgZm9ybWF0KCdlbWJlZGRlZC1vcGVudHlwZScpLCBcXHJcXG4gICAgdXJsKFwiICsgcmVxdWlyZShcIi4vaWNvbmZvbnQud29mZlwiKSArIFwiKSBmb3JtYXQoJ3dvZmYnKSwgXFxyXFxuICAgIHVybChcIiArIHJlcXVpcmUoXCIuL2ljb25mb250LnR0ZlwiKSArIFwiKSBmb3JtYXQoJ3RydWV0eXBlJyksIFxcclxcbiAgICB1cmwoXCIgKyByZXF1aXJlKFwiLi9pY29uZm9udC5zdmdcIikgKyBcIiNpY29uZm9udCkgZm9ybWF0KCdzdmcnKTsgLyogaU9TIDQuMS0gKi9cXHJcXG59XFxyXFxuLmljb25mb250IHtcXHJcXG4gIGZvbnQtZmFtaWx5OlxcXCJpY29uZm9udFxcXCIgIWltcG9ydGFudDtcXHJcXG4gIGZvbnQtc2l6ZToxNnB4O1xcclxcbiAgZm9udC1zdHlsZTpub3JtYWw7XFxyXFxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXHJcXG4gIC13ZWJraXQtdGV4dC1zdHJva2Utd2lkdGg6IDAuMnB4O1xcclxcbiAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTtcXHJcXG59XFxyXFxuLmljb24taHVpZnU6YmVmb3JlIHsgY29udGVudDogXFxcIlxcXFxFNjA4XFxcIjsgfVxcclxcbi5pY29uLWpvYjpiZWZvcmUgeyBjb250ZW50OiBcXFwiXFxcXEU2MDJcXFwiOyB9XFxyXFxuLmljb24tZmFuaHVpOmJlZm9yZSB7IGNvbnRlbnQ6IFxcXCJcXFxcRTYwN1xcXCI7IH1cXHJcXG4uaWNvbi1kaWFuemFuOmJlZm9yZSB7IGNvbnRlbnQ6IFxcXCJcXFxcRTYwOVxcXCI7IH1cXHJcXG4uaWNvbi1zaG91eWU6YmVmb3JlIHsgY29udGVudDogXFxcIlxcXFxFNjAwXFxcIjsgfVxcclxcbi5pY29uLWZhYnU6YmVmb3JlIHsgY29udGVudDogXFxcIlxcXFxFNjBCXFxcIjsgfVxcclxcbi5pY29uLXNoYXJlOmJlZm9yZSB7IGNvbnRlbnQ6IFxcXCJcXFxcRTYwM1xcXCI7IH1cXHJcXG4uaWNvbi13b2RlOmJlZm9yZSB7IGNvbnRlbnQ6IFxcXCJcXFxcRTYwMVxcXCI7IH1cXHJcXG4uaWNvbi1nb29kOmJlZm9yZSB7IGNvbnRlbnQ6IFxcXCJcXFxcRTYwNFxcXCI7IH1cXHJcXG4uaWNvbi14aWFveGk6YmVmb3JlIHsgY29udGVudDogXFxcIlxcXFxFNjBBXFxcIjsgfVxcclxcbi5pY29uLXRvcDpiZWZvcmUgeyBjb250ZW50OiBcXFwiXFxcXEU2MDZcXFwiOyB9XFxyXFxuLmljb24tYXNrOmJlZm9yZSB7IGNvbnRlbnQ6IFxcXCJcXFxcRTYwNVxcXCI7IH1cXHJcXG4uaWNvbi10dWljaHU6YmVmb3JlIHsgY29udGVudDogXFxcIlxcXFxFNjBDXFxcIjsgfVxcclxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyP3tcIm1vZHVsZXNcIjpmYWxzZX0hLi9+L3Bvc3Rjc3MtbG9hZGVyL2xpYj97fSEuL3NyYy9pY29uZm9udC9pY29uZm9udC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oNSkpKDEwOCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0LWRvbS9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDUpKSg4KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tICcuLi8uLi90b29sJztcclxuXHJcbi8v5Zue5aSN5qGGXHJcblxyXG5jbGFzcyBSZXBseUJveCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyBidG5uYW1lOiAn5Zue5aSNJyB9XHJcblxyXG4gICAgICAgIC8vIOaPkOS6pOWbnuWkjVxyXG4gICAgICAgIHRoaXMuc3VibWl0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0geyBidG5uYW1lOiAn5o+Q5Lqk5LitLi4uJyB9XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5wcm9wcy5kYXRhO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgaWYgKGRhdGEucmVwbHlfaWQpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuY29udGVudCA9IGBbQCR7dGhpcy5wcm9wcy5sb2dpbm5hbWV9XSgvdXNlci8ke3RoaXMucHJvcHMubG9naW5uYW1lfSkgJHt0aGlzLnJlZnMuY29udGVudC52YWx1ZX1gO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5jb250ZW50ID0gdGhpcy5yZWZzLmNvbnRlbnQudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRhdGEuY29udGVudCA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsZXJ0KCflm57lpI3lhoXlrrnkuI3og73kuLrnqbrvvIEnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhLmNvbnRlbnQgKz0gJ1xcblxccjwvYnI+LS0tLS3mnaXoh6o8YSBocmVmPVwiaHR0cHM6Ly9sb3Vkb3UxNDA4MDYuZ2l0aHViLmlvL2Nub2RlL1wiIHRhcmdldD1cIl9ibGFua1wiPmNub2Rl5omL5py654mIPC9hPic7XHJcbiAgICAgICAgICAgIFRvb2wucG9zdChgL2FwaS92MS8vdG9waWMvJHtkYXRhLmlkfS9yZXBsaWVzYCwgZGF0YSwgKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGJ0bm5hbWU6ICflm57lpI3miJDlip/vvIzliLfmlrDpobXpnaLkuK0uLicgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnMuY29udGVudC52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgVG9vbC5nZXQoYC9hcGkvdjEvL3RvcGljLyR7ZGF0YS5pZH1gLCB7fSwgKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMucmVMb2FkRGF0YShyZXMuZGF0YSk7IC8v5Yi35paw6aG16Z2iXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGJ0bm5hbWU6ICflm57lpI0nIH0pO1xyXG4gICAgICAgICAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7IGJ0bm5hbWU6ICfliLfmlrDlpLHotKXvvIzor7fmiYvliqjliLfmlrDor5Xor5UnIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSwgKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGJ0bm5hbWU6ICflm57lpI3lpLHotKUnIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVwbHktYm94XCIgc3R5bGU9e3sgZGlzcGxheTogdGhpcy5wcm9wcy5kaXNwbGF5IH19PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0XCI+PHRleHRhcmVhIHJlZj1cImNvbnRlbnRcIiBwbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5wbGFjZWhvbGRlcn0+PC90ZXh0YXJlYT48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1mbGV4PVwibWFpbjpyaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17dGhpcy5zdWJtaXR9Pnt0aGlzLnN0YXRlLmJ0bm5hbWV9PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuUmVwbHlCb3guZGVmYXVsdFByb3BzID0ge1xyXG4gICAgZGlzcGxheTogJ2Jsb2NrJyxcclxuICAgIHBsYWNlaG9sZGVyOiAn5Zue5aSN5pSv5oyBTWFya2Rvd27or63ms5Us6K+35rOo5oSP5qCH6K6w5Luj56CBJ1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVwbHlCb3g7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL3RvcGljL1JlcGx5Qm94LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaWNvbmZvbnQuZW90XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaWNvbmZvbnQvaWNvbmZvbnQuZW90XG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiBnbG9iYWxzIF9fd2VicGFja19hbWRfb3B0aW9uc19fICovXHJcbm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX2FtZF9vcHRpb25zX187XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2FtZC1vcHRpb25zLmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcclxuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCBzdG9yZSBmcm9tICcuL3N0b3JlJztcclxuaW1wb3J0IFJvdXRlciBmcm9tICcuL3JvdXRlJztcclxuaW1wb3J0ICdub3JtYWxpemUuY3NzJztcclxuaW1wb3J0ICdmbGV4LmNzcy9kaXN0L2RhdGEtZmxleC5jc3MnO1xyXG5pbXBvcnQgJy4vaWNvbmZvbnQvaWNvbmZvbnQuY3NzJztcclxuaW1wb3J0ICdnaXRodWItbWFya2Rvd24tY3NzJzsgLy9tYXJrZG93biBjc3NcclxuXHJcbmZ1bmN0aW9uIEFwcCgpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XHJcbiAgICAgICAgICAgIDxSb3V0ZXIgLz5cclxuICAgICAgICA8L1Byb3ZpZGVyPlxyXG4gICAgKVxyXG59XHJcblxyXG5SZWFjdERPTS5yZW5kZXIoPEFwcCAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oNSkpKDEyNyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2hpc3RvcnkvY3JlYXRlQnJvd3Nlckhpc3RvcnkuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXyg1KSkoMTI4KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvaGlzdG9yeS9jcmVhdGVIYXNoSGlzdG9yeS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDUpKSg0KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAzMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDUpKSg5KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2VzL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHRoZSB3aGF0d2ctZmV0Y2ggcG9seWZpbGwgaW5zdGFsbHMgdGhlIGZldGNoKCkgZnVuY3Rpb25cbi8vIG9uIHRoZSBnbG9iYWwgb2JqZWN0ICh3aW5kb3cgb3Igc2VsZilcbi8vXG4vLyBSZXR1cm4gdGhhdCBhcyB0aGUgZXhwb3J0IGZvciB1c2UgaW4gV2VicGFjaywgQnJvd3NlcmlmeSBldGMuXG5yZXF1aXJlKCd3aGF0d2ctZmV0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gc2VsZi5mZXRjaC5iaW5kKHNlbGYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9pc29tb3JwaGljLWZldGNoL2ZldGNoLW5wbS1icm93c2VyaWZ5LmpzIiwiIShmdW5jdGlvbiAobWVyZ2VkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShtZXJnZWQpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IG1lcmdlZCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB3aW5kb3cubWVyZ2VkID0gbWVyZ2VkKCk7XHJcbiAgICB9XHJcbn0pKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvKipcclxuICAgICAqICjlpI3liLblr7nosaEpXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zICjov5Tlm57lpI3liLbnmoTlr7nosaEpXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1lcmdlZCgpIHtcclxuICAgICAgICBmb3IgKHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmcgPSBBcnJheShsZW4pLCBrZXkgPSAwOyBrZXkgPCBsZW47IGtleSsrKSB7XHJcbiAgICAgICAgICAgIGFyZ1trZXldID0gYXJndW1lbnRzW2tleV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb2JqID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGFyZ1tpXSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1ck9iaiA9IGFyZ1tpXVtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzSnNvbihjdXJPYmopKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzSnNvbihvYmpba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0gPSBtZXJnZWQob2JqW2tleV0sIGN1ck9iaik7IC8vIG9iaiDmraTlsZ7mgKflt7Lnu4/mmK/lr7nosaHvvIzliJnlkozor6Xlr7nosaHljp/mnaXnmoTlsZ7mgKflkIjlubZcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpba2V5XSA9IG1lcmdlZChjdXJPYmopOyAvLyBvYmog5q2k5bGe5oCn5LiN5piv5a+56LGh77yM5YiZ5ZKM6K+l5a+56LGh5Y6f5p2l55qE5bGe5oCn5ZCI5bm2XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGN1ck9iaikpIHsgLy/mraTlr7nosaHmmK/mlbDnu4RcclxuICAgICAgICAgICAgICAgICAgICBvYmpba2V5XSA9IG1lcmdlZEFycihjdXJPYmopO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGN1ck9iajsgLy/lsZ7mgKfkuI3mmK9vYmpcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqICjlpI3liLbmlbDnu4QpXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBhcnIgKGRlc2NyaXB0aW9uKVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtZXJnZWRBcnIoYXJyKSB7XHJcbiAgICAgICAgdmFyIGFycjIgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGN1ck9iaiA9IGFycltpXTtcclxuICAgICAgICAgICAgaWYgKGlzSnNvbihjdXJPYmopKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIyW2ldID0gbWVyZ2VkKGN1ck9iaik7IC8vIOWkjeWItuWvueixoVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoY3VyT2JqKSkgeyAvL+WkjeWItuaVsOe7hFxyXG4gICAgICAgICAgICAgICAgYXJyMltpXSA9IG1lcmdlZEFycihjdXJPYmopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJyMltpXSA9IGN1ck9iajsgLy/lsZ7mgKfkuI3mmK9vYmpcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyMjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc0pzb24ob2JqKSB7XHJcbiAgICAgICAgcmV0dXJuICh0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogdHlwZW9mIChvYmopKSA9PSAnb2JqZWN0JyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKS50b0xvd2VyQ2FzZSgpID09PSAnW29iamVjdCBvYmplY3RdJyAmJiAhb2JqLmxlbmd0aDsgLy90cnVlIOaYryBmYWxzZeS4jeaYr1xyXG4gICAgfTtcclxuICAgIGZ1bmN0aW9uIGlzQXJyYXkoYXJyKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpLnRvTG93ZXJDYXNlKCkgPT09ICdbb2JqZWN0IGFycmF5XSc7IC8vdHJ1ZSDmmK8gZmFsc2XkuI3mmK9cclxuICAgIH1cclxuICAgIHJldHVybiBtZXJnZWQ7XHJcbn0pO1xyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9vYmotbWVyZ2VkL2Rpc3Qvb2JqLW1lcmdlZC5qcyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmZ1bmN0aW9uIGNyZWF0ZVRodW5rTWlkZGxld2FyZShleHRyYUFyZ3VtZW50KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBkaXNwYXRjaCA9IF9yZWYuZGlzcGF0Y2gsXG4gICAgICAgIGdldFN0YXRlID0gX3JlZi5nZXRTdGF0ZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGFjdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUsIGV4dHJhQXJndW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgIH07XG4gICAgfTtcbiAgfTtcbn1cblxudmFyIHRodW5rID0gY3JlYXRlVGh1bmtNaWRkbGV3YXJlKCk7XG50aHVuay53aXRoRXh0cmFBcmd1bWVudCA9IGNyZWF0ZVRodW5rTWlkZGxld2FyZTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gdGh1bms7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9yZWR1eC10aHVuay9saWIvaW5kZXguanMiLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0cmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoL1shJygpKl0vZywgZnVuY3Rpb24gKGMpIHtcblx0XHRyZXR1cm4gJyUnICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuXHR9KTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3N0cmljdC11cmktZW5jb2RlL2luZGV4LmpzIiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC8pL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3N0eWxlLWxvYWRlci9saWIvdXJscy5qcyIsIihmdW5jdGlvbihzZWxmKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBpZiAoc2VsZi5mZXRjaCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIHN1cHBvcnQgPSB7XG4gICAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICAgIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICAgIGJsb2I6ICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmICdCbG9iJyBpbiBzZWxmICYmIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICAgIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gICAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxuICB9XG5cbiAgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgICBdXG5cbiAgICB2YXIgaXNEYXRhVmlldyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopXG4gICAgfVxuXG4gICAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICAgIH1cbiAgICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5cXF5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgICB9XG4gICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbiAgZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcbiAgICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxuICAgICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXRlcmF0b3JcbiAgfVxuXG4gIGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMubWFwID0ge31cblxuICAgIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgICAgfSwgdGhpcylcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaGVhZGVycykpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbihoZWFkZXIpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgICB9LCB0aGlzKVxuICAgIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgICB9LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMubWFwW25hbWVdXG4gICAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlKycsJyt2YWx1ZSA6IHZhbHVlXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICAgIGlmICh0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMubWFwW25hbWVdLCBuYW1lLCB0aGlzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKG5hbWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHsgaXRlbXMucHVzaCh2YWx1ZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXNcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgICBpZiAoYm9keS5ib2R5VXNlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxuICAgIH1cbiAgICBib2R5LmJvZHlVc2VkID0gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgICAgfVxuICAgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKVxuICAgIH1cbiAgICByZXR1cm4gY2hhcnMuam9pbignJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICAgIGlmIChidWYuc2xpY2UpIHtcbiAgICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aClcbiAgICAgIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZikpXG4gICAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBCb2R5KCkge1xuICAgIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gICAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICAgIGlmICghYm9keSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5LnRvU3RyaW5nKClcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgICAgLy8gSUUgMTAtMTEgY2FuJ3QgaGFuZGxlIGEgRGF0YVZpZXcgYm9keS5cbiAgICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vuc3VwcG9ydGVkIEJvZHlJbml0IHR5cGUnKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcbiAgICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICByZXR1cm4gY29uc3VtZWQodGhpcykgfHwgUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbiAgdmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuICBmdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XG4gICAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICAgIHJldHVybiAobWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEpID8gdXBjYXNlZCA6IG1ldGhvZFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHtcbiAgICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgICAgfVxuICAgICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICAgIH1cbiAgICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXG4gICAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgICBpZiAoIWJvZHkgJiYgaW5wdXQuX2JvZHlJbml0ICE9IG51bGwpIHtcbiAgICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpXG4gICAgfVxuXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnb21pdCdcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gICAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gICAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICAgIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgICB9XG4gICAgdGhpcy5faW5pdEJvZHkoYm9keSlcbiAgfVxuXG4gIFJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHsgYm9keTogdGhpcy5fYm9keUluaXQgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gICAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxuICAgIGJvZHkudHJpbSgpLnNwbGl0KCcmJykuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gZm9ybVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKClcbiAgICByYXdIZWFkZXJzLnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6JylcbiAgICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgICAgaWYgKGtleSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5qb2luKCc6JykudHJpbSgpXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gaGVhZGVyc1xuICB9XG5cbiAgQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG4gIGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG5cbiAgICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgICB0aGlzLnN0YXR1cyA9ICdzdGF0dXMnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1cyA6IDIwMFxuICAgIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcbiAgICB0aGlzLnN0YXR1c1RleHQgPSAnc3RhdHVzVGV4dCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzVGV4dCA6ICdPSydcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICAgIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxuICB9XG5cbiAgQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuICBSZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICAgIHVybDogdGhpcy51cmxcbiAgICB9KVxuICB9XG5cbiAgUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICAgIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH1cblxuICB2YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuICBSZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gICAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxuICB9XG5cbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxuXG4gIHNlbGYuZmV0Y2ggPSBmdW5jdGlvbihpbnB1dCwgaW5pdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnVybCA9ICdyZXNwb25zZVVSTCcgaW4geGhyID8geGhyLnJlc3BvbnNlVVJMIDogb3B0aW9ucy5oZWFkZXJzLmdldCgnWC1SZXF1ZXN0LVVSTCcpXG4gICAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgICAgfVxuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcblxuICAgICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfSlcblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgICB9KVxuICB9XG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3doYXR3Zy1mZXRjaC9mZXRjaC5qcyIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IE5hdkxpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0ICcuL2luZGV4Lmxlc3MnO1xyXG5cclxuY2xhc3MgSGVhZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7bGVmdEljb24sIGxlZnRDbGljaywgcmlnaHRUbywgcmlnaHRJY29uLCByaWdodENsaWNrLCB0aXRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsZXQgbGVmdCA9IG51bGw7XHJcbiAgICAgICAgaWYobGVmdEljb24pe1xyXG4gICAgICAgICAgICBsZWZ0ID0gKFxyXG4gICAgICAgICAgICAgICAgPGEgb25DbGljaz17bGVmdENsaWNrfSBjbGFzc05hbWU9J2xlZnQnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17J2ljb25mb250IGljb24tJyArIGxlZnRJY29uIH0+PC9pPiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByaWdodCA9IG51bGw7XHJcbiAgICAgICAgaWYgKHJpZ2h0VG8gJiYgcmlnaHRJY29uKSB7XHJcbiAgICAgICAgICAgIHJpZ2h0ID0gKFxyXG4gICAgICAgICAgICAgICAgPE5hdkxpbmsgdG89e3JpZ2h0VG99IGNsYXNzTmFtZT0ncmlnaHQnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17J2ljb25mb250IGljb24tJyArIHJpZ2h0SWNvbn0+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmlnaHRDbGljayAmJiByaWdodEljb24pIHtcclxuICAgICAgICAgICAgcmlnaHQgPSAoXHJcbiAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtyaWdodENsaWNrfSBjbGFzc05hbWU9J3JpZ2h0Jz5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9eydpY29uZm9udCBpY29uLScgKyByaWdodEljb259PjwvaT5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b3BpYy1oZWFkXCI+XHJcbiAgICAgICAgICAgICAgICB7bGVmdH1cclxuICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0aXRsZVwiPnt0aXRsZX08L2gzPlxyXG4gICAgICAgICAgICAgICAge3JpZ2h0fVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIZWFkZXI7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL0hlYWRlci9pbmRleC5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCAnLi9pbmRleC5sZXNzJztcclxuIFxyXG5jbGFzcyBMb2FkaW5nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBsZXQge2xvYWRBbmltYXRpb24sIGxvYWRNc2d9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17J2RhdGEtbG9hZCBkYXRhLWxvYWQtJyArIGxvYWRBbmltYXRpb259PlxyXG4gICAgICAgICAgICAgICAge2xvYWRBbmltYXRpb24gPyA8ZGl2IGNsYXNzTmFtZT1cIm1zZ1wiPntsb2FkTXNnfTwvZGl2PiA6IG51bGwgfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbkxvYWRpbmcuZGVmYXVsdFByb3BzID0ge1xyXG4gICAgbG9hZEFuaW1hdGlvbjogdHJ1ZSwgLy/pu5jorqTmmL7npLrliqDovb3liqjnlLtcclxuICAgIGxvYWRNc2c6ICfmraPlnKjliqDovb3kuK0nXHJcbn1cclxuICAgIFxyXG5leHBvcnQgZGVmYXVsdCBMb2FkaW5nO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL0xvYWRpbmcvaW5kZXguanMiLCJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcclxuXHJcbmNsYXNzIE5vRGF0YSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6ICcyMHB4Jyx0ZXh0QWxpZ246ICdjZW50ZXInLCBjb2xvcjogJyMzMzMnLHBhZGRpbmc6JzIwcHgnIH19PuaaguaXoOiusOW9lTwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5vRGF0YTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG9uZW50cy9Ob0RhdGEuanMiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFiSWNvbiBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdmFyIHt0YWIsIHRvcCwgZ29vZH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBpZiAodG9wKSB7XHJcbiAgICAgICAgICAgIHRhYiA9ICd0b3AnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZ29vZCkge1xyXG4gICAgICAgICAgICB0YWIgPSAnZ29vZCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9eydpY29uZm9udCBpY29uLScgKyB0YWJ9PjwvaT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL1RhYkljb24uanMiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBOYXZMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcblxyXG5jbGFzcyBUaXBNc2dTaWduaW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGlwLW1zZy1zaWduaW5cIj5cclxuICAgICAgICAgICAgICAgIOS9oOi/mOacqueZu+W9le+8jOivt+WFiDxOYXZMaW5rIHRvPVwiL2xvZ2luXCI+55m75b2VPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUaXBNc2dTaWduaW47XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL1RpcE1zZ1NpZ25Jbi5qcyIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VySGVhZEltZyBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cInVzZXItaGVhZGltZ1wiIHN0eWxlPXt7IGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgdGhpcy5wcm9wcy51cmwgKyAnKScgfX0+PC9kaXY+KVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvVXNlckhlYWRJbWcuanMiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5cclxuY2xhc3MgTmV3VG9waWMgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9waWMtY3JlYXRlXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IG5hbWU9XCJ0YWJcIiBkZWZhdWx0VmFsdWU9e3RoaXMucHJvcHMudGFifSBvbklucHV0PXt0aGlzLnByb3BzLnRhYklucHV0fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuivt+mAieaLqeWPkeihqOexu+Weizwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic2hhcmVcIj7liIbkuqs8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImFza1wiPumXruetlDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiam9iXCI+5oub6IGYPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9J2Rldic+5rWL6K+VPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy50aXRsZX0gb25JbnB1dD17dGhpcy5wcm9wcy50aXRsZUlucHV0fSBwbGFjZWhvbGRlcj1cIuagh+mimOWtl+aVsCAxMCDlrZfku6XkuIpcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLmNvbnRlbnR9IG9uSW5wdXQ9e3RoaXMucHJvcHMuY29udGVudElucHV0fSBwbGFjZWhvbGRlcj1cIuWGheWuueWtl+aVsCAzMCDlrZfku6XkuIpcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5ld1RvcGljO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9jcmVhdGUvTmV3VG9waWMuanMiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xyXG5pbXBvcnQgeyBOYXZMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vLi4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tICcuLi8uLi90b29sJztcclxuaW1wb3J0IE5ld1RvcGljIGZyb20gJy4vTmV3VG9waWMnO1xyXG5pbXBvcnQgJy4vaW5kZXgubGVzcyc7XHJcbmltcG9ydCB7IExvYWRpbmcsIFRpcE1zZ1NpZ25pbiwgSGVhZGVyIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cyc7XHJcblxyXG5jbGFzcyBDcmVhdGUgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIC8vIOWIneWni+WMlue7hOS7tueKtuaAgVxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnJyxcclxuICAgICAgICAgICAgdGFiOiAnJyxcclxuICAgICAgICAgICAgY29udGVudDogJycsXHJcbiAgICAgICAgICAgIGFjY2Vzc3Rva2VuOiB0aGlzLnByb3BzLlVzZXIgPyB0aGlzLnByb3BzLlVzZXIuYWNjZXNzdG9rZW4gOiAnJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wcm9wcy5Vc2VyKVxyXG4gICAgICAgIHRoaXMucG9zdFN0YXRlID0gZmFsc2U7XHJcbiAgICAgICAgLy8g5Y+R6KGo5Li76aKYXHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIge3N0YXRlfSA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBvc3RTdGF0ZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzdGF0ZS50YWIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhbGVydCgn6K+36YCJ5oup5Y+R6KGo57G75Z6LJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUudGl0bGUubGVuZ3RoIDwgMTApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhbGVydCgn5qCH6aKY5a2X5pWwMTDlrZfku6XkuIonKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5jb250ZW50Lmxlbmd0aCA8IDMwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxlcnQoJ+WGheWuueWtl+aVsDMw5a2X5Lul5LiKJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5wb3N0U3RhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBUb29sLnBvc3QoJy9hcGkvdjEvdG9waWNzJywgdGhpcy5zdGF0ZSwgKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnJvdXRlci5oaXN0b3J5LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRobmFtZTogJy90b3BpYy8nICsgcmVzLnRvcGljX2lkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflj5HooajlpLHotKUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3RTdGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgn5Y+R6KGo5aSx6LSlJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc3RTdGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+ebkeWQrOeUqOaIt+mAieaLqeWPkeihqOexu+Wei1xyXG5cclxuICAgICAgICB0aGlzLnRhYklucHV0ID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS50YWIgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOebkeWQrOeUqOaIt+i+k+WFpeagh+mimFxyXG4gICAgICAgIHRoaXMudGl0bGVJbnB1dCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudGl0bGUgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v55uR5ZCs55So5oi36L6T5YWl5YaF5a65XHJcbiAgICAgICAgdGhpcy5jb250ZW50SW5wdXQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmNvbnRlbnQgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciB7IFVzZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgdmFyIGhlYWRlclNldCA9IHt9O1xyXG4gICAgICAgIHZhciBtYWluID0gbnVsbDtcclxuICAgICAgICBpZiAoIVVzZXIpIHtcclxuICAgICAgICAgICAgbWFpbiA9IDxUaXBNc2dTaWduaW4gLz5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtYWluID0gPE5ld1RvcGljIHsuLi50aGlzLnN0YXRlfSB0YWJJbnB1dD17dGhpcy50YWJJbnB1dH0gdGl0bGVJbnB1dD17dGhpcy50aXRsZUlucHV0fSBjb250ZW50SW5wdXQ9e3RoaXMuY29udGVudElucHV0fSAvPlxyXG4gICAgICAgICAgICBoZWFkZXJTZXQgPSB7XHJcbiAgICAgICAgICAgICAgICByaWdodEljb246ICdmYWJ1JyxcclxuICAgICAgICAgICAgICAgIHJpZ2h0Q2xpY2s6IHRoaXMucmlnaHRDbGlja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPEhlYWRlciB0aXRsZT1cIuWPkeihqOS4u+mimFwiIHsuLi5oZWFkZXJTZXR9IC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnNjBweCd9fT5cclxuICAgICAgICAgICAgICAgICAgICB7bWFpbn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuQ3JlYXRlLmNvbnRleHRUeXBlcyA9IHtcclxuICAgIHJvdXRlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcclxuICAgIHN0YXRlID0+IHsgXHJcbiAgICAgICAgcmV0dXJuIHsgVXNlcjogc3RhdGUuVXNlciB9IFxyXG4gICAgfSwgZGlzcGF0Y2ggPT4ge1xyXG4gICAgICAgIHJldHVybiB7IGNyZWF0ZUFjdGlvbjogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKSB9XHJcbiAgICB9XHJcbikoQ3JlYXRlKTsgLy/ov57mjqVyZWR1eFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9jcmVhdGUvaW5kZXguanMiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBiaW5kQWN0aW9uQ3JlYXRvcnMgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IE5hdkxpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0IHF1ZXJ5U3RyaW5nIGZyb20gJ3F1ZXJ5LXN0cmluZyc7XHJcbmltcG9ydCBhY3Rpb25zIGZyb20gJy4uLy4uL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyBUb29sIH0gZnJvbSAnLi4vLi4vdG9vbCc7XHJcbmltcG9ydCBfc3R5bGUgZnJvbSAnLi4vLi4vc3R5bGUvc3R5bGUubGVzcyc7XHJcbmltcG9ydCAnLi9pbmRleC5sZXNzJztcclxuaW1wb3J0IE5hdiBmcm9tICcuL25hdic7XHJcbmltcG9ydCBMaXN0IGZyb20gJy4vbGlzdCc7XHJcblxyXG5jbGFzcyBIb21lIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKXtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTY3JvbGwgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gdGFyZ2V0LnNjcm9sbFRvcCxzY3JvbGxIZWlnaHQgPSB0YXJnZXQuc2Nyb2xsSGVpZ2h0IC0gNzgsY29udGFpbmVySGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgICAgICAgICBjb25zdCB7IHBhZ2UsIGxpbWl0LCBtZHJlbmRlciwgaXNGZXRjaGluZyB9ID0gdGhpcy5wcm9wcy5zdGF0ZTtcclxuICAgICAgICAgICAgY29uc3QgdGFiID0gcXVlcnlTdHJpbmcucGFyc2UodGhpcy5wcm9wcy5sb2NhdGlvbi5zZWFyY2gpLnRhYiB8fCAnYWxsJztcclxuICAgICAgICAgICAgaWYoc2Nyb2xsVG9wID4gKHNjcm9sbEhlaWdodCAtIGNvbnRhaW5lckhlaWdodCAtMzApKSB7XHJcbiAgICAgICAgICAgICAgICBpZihpc0ZldGNoaW5nKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMuZmV0Y2hMaXN0KCcvYXBpL3YxL3RvcGljcycsIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWI6IHRhYixcclxuICAgICAgICAgICAgICAgICAgICBsaW1pdCxcclxuICAgICAgICAgICAgICAgICAgICBwYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1kcmVuZGVyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VUYWIgPSAodGFiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgbGltaXQsIG1kcmVuZGVyIH0gPSB0aGlzLnByb3BzLnN0YXRlO1xyXG4gICAgICAgICAgICBsZXQgcGFnZSA9IHRoaXMucHJvcHMuc3RhdGUucGFnZTtcclxuICAgICAgICAgICAgaWYoIHRhYiAhPT0gdGhpcy5wcm9wcy5zdGF0ZS50YWIgKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMuZmV0Y2hMaXN0KCcvYXBpL3YxL3RvcGljcycsIHtcclxuICAgICAgICAgICAgICAgIHRhYjogdGFiIHx8ICdhbGwnLFxyXG4gICAgICAgICAgICAgICAgbGltaXQsXHJcbiAgICAgICAgICAgICAgICBwYWdlOiBwYWdlLFxyXG4gICAgICAgICAgICAgICAgbWRyZW5kZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5wcm9wcy5zdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2hvbWVNb3VudCcpO1xyXG4gICAgICAgIC8vIHZhciBzY3JvbGwgPSBUb29sLmFkZEV2ZW50KHdpbmRvdywgJ3Njcm9sbCcsIHRoaXMuaGFuZGxlU2Nyb2xsLCBmYWxzZSk7XHJcbiAgICAgICAgY29uc3QgeyBwYWdlLCBsaW1pdCwgbWRyZW5kZXIgfSA9IHRoaXMucHJvcHMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5hY3Rpb25zLmZldGNoTGlzdCgnL2FwaS92MS90b3BpY3MnLCB7XHJcbiAgICAgICAgICAgIHRhYjogcXVlcnlTdHJpbmcucGFyc2UodGhpcy5wcm9wcy5sb2NhdGlvbi5zZWFyY2gpLnRhYiB8fCAnYWxsJyxcclxuICAgICAgICAgICAgbGltaXQsXHJcbiAgICAgICAgICAgIHBhZ2UsXHJcbiAgICAgICAgICAgIG1kcmVuZGVyXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBjb25zdCB0YWIgPSBxdWVyeVN0cmluZy5wYXJzZSh0aGlzLnByb3BzLmxvY2F0aW9uLnNlYXJjaCkudGFiIHx8ICdhbGwnO1xyXG4gICAgICAgIGNvbnN0IHsgc3RhdGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxOYXYgdGFiPXt0YWJ9IGNoYW5nZVRhYj17dGhpcy5jaGFuZ2VUYWJ9IHsuLi50aGlzLnByb3BzfS8+XHJcbiAgICAgICAgICAgICAgICA8TGlzdCBkYXRhPXtzdGF0ZS5saXN0c30gaXNGZXRjaGluZz17c3RhdGUuaXNGZXRjaGluZ33jgIBoYW5kbGVTY3JvbGw9e3RoaXMuaGFuZGxlU2Nyb2xsfS8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoIHN0YXRlID0+IHtcclxuICAgIHJldHVybiB7IHN0YXRlOiBzdGF0ZS5mZXRjaExpc3QgfTtcclxufSwgKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4geyBhY3Rpb25zOiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9ucywgZGlzcGF0Y2gpfTtcclxufSkoSG9tZSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2hvbWUvaW5kZXguanMiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBOYXZMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCB7IFRhYkljb24sIFVzZXJIZWFkSW1nLCBMb2FkaW5nIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cyc7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tICcuLi8uLi90b29sJztcclxuXHJcbmNsYXNzIExpc3QgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2xpc3RNb3VudCcpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgY29uc3QgeyBkYXRhLCBpc0ZldGNoaW5nIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5kZXgtbGlzdFwiIG9uU2Nyb2xsPXt0aGlzLnByb3BzLmhhbmRsZVNjcm9sbH0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8TGlzdEl0ZW0ga2V5PXtpdGVtLmlkfSB7Li4uaXRlbX0gLz5cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPExvYWRpbmcgbG9hZEFuaW1hdGlvbj17aXNGZXRjaGluZ30gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTGlzdEl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiBuZXh0UHJvcHMuc3RhdGUgIT0gdGhpcy5wcm9wcy5zdGF0ZTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBsZXQge2lkLCB0aXRsZSwgYXV0aG9yLCB2aXNpdF9jb3VudCwgcmVwbHlfY291bnQsIGNyZWF0ZV9hdCwgbGFzdF9yZXBseV9hdH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgIDxOYXZMaW5rIHRvPXtgL3RvcGljLyR7aWR9YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWZsZXg9XCJib3g6Zmlyc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb250XCIgZGF0YS1mbGV4PVwiY3Jvc3M6Y2VudGVyXCI+PFRhYkljb24gey4uLnRoaXMucHJvcHN9IC8+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0aXRcIj57dGl0bGV9PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvdHRvbVwiIGRhdGEtZmxleD1cImJveDpmaXJzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF1dGhvclwiIGRhdGEtZmxleD1cImNyb3NzOmNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVzZXJIZWFkSW1nIHVybD17YXV0aG9yLmF2YXRhcl91cmx9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvblwiIGRhdGEtZmxleD1cImRpcjp0b3AgbWFpbjpjZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGRhdGEtZmxleD1cImNyb3NzOmNlbnRlciBib3g6bGFzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm5hbWVcIj57YXV0aG9yLmxvZ2lubmFtZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY291bnRcIj57cmVwbHlfY291bnR9L3t2aXNpdF9jb3VudH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBkYXRhLWZsZXg9XCJjcm9zczpjZW50ZXIgYm94Omxhc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGltZSBjbGFzc05hbWU9XCJjcmVhdGVcIj57VG9vbC5mb3JtYXREYXRlKGNyZWF0ZV9hdCl9PC90aW1lPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aW1lIGNsYXNzTmFtZT1cInJlXCI+e1Rvb2wuZm9ybWF0RGF0ZShsYXN0X3JlcGx5X2F0KX08L3RpbWU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExpc3Q7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2hvbWUvbGlzdC5qcyIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IE5hdkxpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0IHF1ZXJ5U3RyaW5nIGZyb20gJ3F1ZXJ5LXN0cmluZyc7XHJcblxyXG5jbGFzcyBOYXYgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgaXNGZWN0aGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhZ2U6IDFcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0YWIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qgc2VjID0ge307XHJcbiAgICAgICAgc2VjW3RhYl0gPSAnb24nO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9wTmF2XCI+XHJcbiAgICAgICAgICAgICAgICA8dWwgZGF0YS1mbGV4PVwiYm94Om1lYW5cIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtzZWMuYWxsfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgdG89XCIvP3RhYj1hbGxcIiBhY3RpdmVDbGFzc05hbWU9XCJ0b3BOYXZBY3RpdmVcIiBvbkNsaWNrPXsoKSA9PiB7dGhpcy5wcm9wcy5jaGFuZ2VUYWIoJ2FsbCcpfX0+5YWo6YOoPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17c2VjLmdvb2R9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayB0bz1cIi8/dGFiPWdvb2RcIiBhY3RpdmVDbGFzc05hbWU9XCJ0b3BOYXZBY3RpdmVcIiBvbkNsaWNrPXsoKSA9PiB7dGhpcy5wcm9wcy5jaGFuZ2VUYWIoJ2dvb2QnKX19PueyvuWNjjwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e3NlYy5zaGFyZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIHRvPVwiLz90YWI9c2hhcmVcIiBhY3RpdmVDbGFzc05hbWU9XCJ0b3BOYXZBY3RpdmVcIiBvbkNsaWNrPXsoKSA9PiB7dGhpcy5wcm9wcy5jaGFuZ2VUYWIoJ3NoYXJlJyl9fT7liIbkuqs8L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtzZWMuYXNrfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgdG89XCIvP3RhYj1hc2tcIiBhY3RpdmVDbGFzc05hbWU9XCJ0b3BOYXZBY3RpdmVcIiBvbkNsaWNrPXsoKSA9PiB7dGhpcy5wcm9wcy5jaGFuZ2VUYWIoJ2FzaycpfX0+6Zeu562UPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17c2VjLmpvYn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIHRvPVwiLz90YWI9am9iXCIgYWN0aXZlQ2xhc3NOYW1lPVwidG9wTmF2QWN0aXZlXCIgb25DbGljaz17KCkgPT4ge3RoaXMucHJvcHMuY2hhbmdlVGFiKCdqb2InKX19PuaLm+iBmDwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTmF2O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9ob21lL25hdi5qcyIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IE5hdkxpbmssIFJvdXRlLCBTd2l0Y2ggfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgYmluZEFjdGlvbkNyZWF0b3JzIH0gZnJvbSAncmVkdXgnO1xyXG5pbXBvcnQgSG9tZSBmcm9tICcuL2hvbWUnO1xyXG5pbXBvcnQgQ3JlYXRlIGZyb20gJy4vY3JlYXRlJztcclxuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi9tZXNzYWdlJztcclxuaW1wb3J0IFVzZXJWaWV3IGZyb20gJy4vdXNlcic7XHJcblxyXG5jbGFzcyBSb290IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7bWF0Y2gsIFVzZXJ9ID0gIHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2XCIgZGF0YS1mbGV4PVwiYm94Om1lYW5cIj5cclxuICAgICAgICAgICAgICAgICAgICA8TmF2TGluayB0bz1cIi9cIiBleGFjdCBhY3RpdmVDbGFzc05hbWU9XCJhY3RpdmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbmZvbnQgaWNvbi1zaG91eWVcIj48L2k+6aaW6aG1XHJcbiAgICAgICAgICAgICAgICAgICAgPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIHRvPVwiL2NyZWF0ZVwiIGFjdGl2ZUNsYXNzTmFtZT1cImFjdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uZm9udCBpY29uLWZhYnVcIj48L2k+5Y+R6KGoXHJcbiAgICAgICAgICAgICAgICAgICAgPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIHRvPVwiL21lc3NhZ2VcIiBhY3RpdmVDbGFzc05hbWU9XCJhY3RpdmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbmZvbnQgaWNvbi14aWFveGlcIj48L2k+5raI5oGvXHJcbiAgICAgICAgICAgICAgICAgICAgPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIHRvPXtVc2VyID8gJy91c2VyLycrIFVzZXIubG9naW5uYW1lIDogJy9sb2dpbicgfSBhY3RpdmVDbGFzc05hbWU9XCJhY3RpdmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbmZvbnQgaWNvbi13b2RlXCI+PC9pPuaIkeeahFxyXG4gICAgICAgICAgICAgICAgICAgIDwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD0nLycgZXhhY3QgY29tcG9uZW50PXtIb21lfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPScvY3JlYXRlJyBjb21wb25lbnQ9e0NyZWF0ZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD0nL21lc3NhZ2UnIGNvbXBvbmVudD17TWVzc2FnZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD0nL3VzZXIvOmxvZ2lubmFtZScgY29tcG9uZW50PXtVc2VyVmlld30gLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxyXG4gICAgc3RhdGUgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IFVzZXI6IHN0YXRlLlVzZXIsSG9tZTogc3RhdGUuZmV0Y2hMaXN0IH1cclxuICAgIH1cclxuKShSb290KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvaW5kZXguanMiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XHJcbmltcG9ydCB7IE5hdkxpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgYmluZEFjdGlvbkNyZWF0b3JzIH0gZnJvbSAncmVkdXgnO1xyXG5pbXBvcnQgYWN0aW9ucyBmcm9tICcuLi8uLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgVG9vbCB9IGZyb20gJy4uLy4uL3Rvb2wnO1xyXG5pbXBvcnQgJy4vaW5kZXgubGVzcyc7XHJcbmltcG9ydCB7IExvYWRpbmcsIEhlYWRlciwgVGlwTXNnU2lnbmluIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cyc7XHJcblxyXG5jbGFzcyBNaW5lIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbjogJ+eZu+W9lScsXHJcbiAgICAgICAgICAgIGxvZ2lub3V0QnRuOiAn6YCA5Ye655m75b2VJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zaWduaW4gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBhY2Nlc3N0b2tlbiA9IHRoaXMucmVmcy5hY2Nlc3N0b2tlbi52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCFhY2Nlc3N0b2tlbikgcmV0dXJuIGFsZXJ0KCfkuI3og73kuLrnqbrvvIEnKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGJ1dHRvbjogJ+eZu+W9leS4rS4uLicgfSk7XHJcbiAgICAgICAgICAgIFRvb2wucG9zdCgnL2FwaS92MS9hY2Nlc3N0b2tlbicsIHsgYWNjZXNzdG9rZW4gfSwgKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+eZu+W9leaIkOWKnycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5hY2Nlc3N0b2tlbiA9IGFjY2Vzc3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5sb2dpbkluKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnJvdXRlci5oaXN0b3J5LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRobmFtZTogJy91c2VyLycgKyByZXMubG9naW5uYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfnmbvlvZXlpLHotKUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYnV0dG9uOiAn55m75b2VJyB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfnmbvlvZXlpLHotKXvvIEnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBidXR0b246ICfnmbvlvZUnIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc2lnbk91dCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGFjY2Vzc3Rva2VuID0gdGhpcy5wcm9wcy5Vc2VyLmFjY2Vzc3Rva2VuO1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbG9naW5vdXRCdG46ICfpgIDlh7rnmbvlvZXkuK0uLi4nIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMubG9naW5PdXQoKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5oaXN0b3J5LnB1c2goJy8nKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgVXNlciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsZXQgaGVhZCA9IG51bGw7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSBudWxsO1xyXG4gICAgICAgIGlmKCFVc2VyKXtcclxuICAgICAgICAgICAgaGVhZCA9ICg8SGVhZGVyIHRpdGxlPVwi55m75b2VXCIgbGVmdEljb249XCJmYW5odWlcIiBsZWZ0Q2xpY2s9e3RoaXMucHJvcHMuaGlzdG9yeS5nb0JhY2t9Lz4pO1xyXG4gICAgICAgICAgICBjb250ZW50ID0gKDxkaXYgY2xhc3NOYW1lPVwiY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dFwiPjxpbnB1dCByZWY9XCJhY2Nlc3N0b2tlblwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJBY2Nlc3MgVG9rZW5cIiAvPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9e3RoaXMuc2lnbmlufT57dGhpcy5zdGF0ZS5idXR0b259PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGhlYWQgPSAoPEhlYWRlciB0aXRsZT1cIumAgOWHuueZu+W9lVwiIGxlZnRJY29uPVwiZmFuaHVpXCIgbGVmdENsaWNrPXt0aGlzLnByb3BzLmhpc3RvcnkuZ29CYWNrfS8+KTtcclxuICAgICAgICAgICAgY29udGVudCA9ICg8ZGl2IGNsYXNzTmFtZT1cImNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHRcIj7noa7lrprpgIDlh7rnmbvlvZXvvJ88L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJsb2dpbm91dCBidG5cIiBvbkNsaWNrPXt0aGlzLnNpZ25PdXR9Pnt0aGlzLnN0YXRlLmxvZ2lub3V0QnRufTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PilcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIHtoZWFkfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaWduaW5cIiBkYXRhLWZsZXg9XCJkaXI6dG9wIG1haW46Y2VudGVyIGNyb3NzOmNlbnRlclwiIHN0eWxlPXt7bWFyZ2luVG9wOic2MHB4J319PlxyXG4gICAgICAgICAgICAgICAgICAgIHtjb250ZW50fVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuTWluZS5jb250ZXh0VHlwZXMgPSB7XHJcbiAgICByb3V0ZXI6IFByb3BUeXBlcy5vYmplY3RcclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXHJcbiAgICBzdGF0ZSA9PiB7IFxyXG4gICAgICAgIHJldHVybiB7IFVzZXI6IHN0YXRlLlVzZXIgfVxyXG4gICAgfSxcclxuICAgIGRpc3BhdGNoID0+IHsgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWN0aW9uczogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKVxyXG4gICAgICAgIH0gXHJcbiAgICB9XHJcbiAgICAgKShNaW5lKTsgLy/ov57mjqVyZWR1eFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9sb2dpbi9pbmRleC5qcyIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IE5hdkxpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0IHsgVXNlckhlYWRJbWcgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzJztcclxuaW1wb3J0IHsgVG9vbCB9IGZyb20gJy4uLy4uL3Rvb2wnO1xyXG4vLyDmtojmga/lhoXlrrlcclxuY2xhc3MgQ29udGVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdmFyIGxpc3QgPSB0aGlzLnByb3BzLmxpc3Q7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtc2ctYm94XCI+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIge3R5cGUsIGF1dGhvciwgdG9waWMsIHJlcGx5LCBoYXNfcmVhZH0gPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09ICdhdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gPGRpdj7lnKjor53popg8TmF2TGluayB0bz17YC90b3BpYy8ke3RvcGljLmlkfWB9Pnt0b3BpYy50aXRsZX08L05hdkxpbms+5LitIEDkuobkvaA8L2Rpdj47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSA8ZGl2PuWbnuWkjeS9oOS6hueahOivnemimDxOYXZMaW5rIHRvPXtgL3RvcGljLyR7dG9waWMuaWR9YH0+e3RvcGljLnRpdGxlfTwvTmF2TGluaz48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGRhdGEtZmxleD1cImJveDpmaXJzdFwiIGtleT17aW5kZXh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayBjbGFzc05hbWU9XCJ1c2VyXCIgdG89e2AvdXNlci8ke2F1dGhvci5sb2dpbm5hbWV9YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VXNlckhlYWRJbWcgdXJsPXthdXRob3IuYXZhdGFyX3VybH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYW1lXCI+e2F1dGhvci5sb2dpbm5hbWV9PHRpbWU+e1Rvb2wuZm9ybWF0RGF0ZShyZXBseS5jcmVhdGVfYXQpfTwvdGltZT48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1mbGV4PVwiYm94OmZpcnN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWZsZXg9XCJjcm9zczpjZW50ZXJcIj48ZGl2IGNsYXNzTmFtZT17YGRpYW4tJHtoYXNfcmVhZH1gfT48L2Rpdj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y29udGVudH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb250ZW50O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9tZXNzYWdlL0NvbnRlbnQuanMiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBOYXZMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vLi4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tICcuLi8uLi90b29sJztcclxuaW1wb3J0IENvbnRlbnQgZnJvbSAnLi9Db250ZW50JztcclxuaW1wb3J0IHsgTG9hZGluZywgSGVhZGVyLCBUaXBNc2dTaWduaW4sIFVzZXJIZWFkSW1nLCBOb0RhdGEgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzJztcclxuXHJcbmNsYXNzIE1lc3NhZ2UgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9ICcvYXBpL3YxL21lc3NhZ2VzJztcclxuICAgICAgICBpZighdGhpcy5wcm9wcy5Vc2VyKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgYWNjZXNzdG9rZW4gPSB0aGlzLnByb3BzLlVzZXIuYWNjZXNzdG9rZW47XHJcbiAgICAgICAgdGhpcy5wcm9wcy5tZXNzYWdlQWN0aW9uLmZldGNoTWVzc2FnZSh1cmwsIHtcclxuICAgICAgICAgICAgYWNjZXNzdG9rZW46IGFjY2Vzc3Rva2VuLFxyXG4gICAgICAgICAgICBtZHJlbmRlcjogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciB7IGRhdGEsIGlzRmV0Y2hpbmcsIGlkLCB0YWJJbmRleCB9ID0gdGhpcy5wcm9wcy5zdGF0ZTtcclxuICAgICAgICB2YXIgeyBVc2VyIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHZhciBtYWluID0gbnVsbDtcclxuICAgICAgICBpZiAoIVVzZXIpIHtcclxuICAgICAgICAgICAgbWFpbiA9IDxUaXBNc2dTaWduaW4gLz5cclxuICAgICAgICB9IGVsc2UgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIG1haW4gPSA8TG9hZGluZyBsb2FkQW5pbWF0aW9uPXtpc0ZldGNoaW5nfSAvPjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQge2hhc25vdF9yZWFkX21lc3NhZ2VzLCBoYXNfcmVhZF9tZXNzYWdlc30gPSBkYXRhO1xyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShoYXNub3RfcmVhZF9tZXNzYWdlcywgaGFzX3JlYWRfbWVzc2FnZXMpO1xyXG4gICAgICAgICAgICBpZihoYXNub3RfcmVhZF9tZXNzYWdlcy5sZW5ndGggPD0gMCl7XHJcbiAgICAgICAgICAgICAgICBtYWluID0gPE5vRGF0YSAvPjtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBtYWluID0gPENvbnRlbnQgbGlzdD17aGFzbm90X3JlYWRfbWVzc2FnZXN9IC8+O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8SGVhZGVyIHRpdGxlPVwi5raI5oGvXCIgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICc2MHB4J319PlxyXG4gICAgICAgICAgICAgICAgICAgIHttYWlufVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXHJcbiAgICBzdGF0ZSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhdGU6IHN0YXRlLmZldGNoTWVzc2FnZSwgVXNlcjogc3RhdGUuVXNlciB9XHJcbiAgICB9LCBkaXNwYXRjaCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgbWVzc2FnZUFjdGlvbjogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKSB9XHJcbiAgICB9XHJcbikoTWVzc2FnZSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL21lc3NhZ2UvaW5kZXguanMiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBOYXZMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tICcuLi8uLi90b29sJztcclxuaW1wb3J0IHsgVGlwTXNnU2lnbmluLCBVc2VySGVhZEltZywgVGFiSWNvbiB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMnO1xyXG5pbXBvcnQgUmVMaXN0IGZyb20gJy4vUmVMaXN0JztcclxuaW1wb3J0IFJlcGx5Qm94IGZyb20gJy4vUmVwbHlCb3gnO1xyXG5cclxuY2xhc3MgQXJ0aWNsZSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIge2lkLCB0aXRsZSwgY3JlYXRlX2F0LCB2aXNpdF9jb3VudCwgcmVwbHlfY291bnQsIGNvbnRlbnQsIHJlcGxpZXMsIGF1dGhvcn0gPSB0aGlzLnByb3BzLnN0YXRlLmRhdGE7XHJcbiAgICAgICAgdmFyIGNyZWF0ZU1hcmt1cCA9ICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIF9faHRtbDogY29udGVudFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYm90dG9tID0gdGhpcy5wcm9wcy5Vc2VyID8gPFJlcGx5Qm94IHJlTG9hZERhdGE9e3RoaXMucHJvcHMucmVMb2FkRGF0YX0gZGF0YT17eyBhY2Nlc3N0b2tlbjogdGhpcy5wcm9wcy5Vc2VyLmFjY2Vzc3Rva2VuLCBpZCB9fSAvPiA6IDxUaXBNc2dTaWduaW4gLz47XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b3BpY1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1c2VyXCIgZGF0YS1mbGV4PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGltZ1wiIGRhdGEtZmxleC1ib3g9XCIwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxVc2VySGVhZEltZyB1cmw9e2F1dGhvci5hdmF0YXJfdXJsfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGF0YVwiIGRhdGEtZmxleD1cImRpcjp0b3BcIiBkYXRhLWZsZXgtYm94PVwiMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtZmxleD1cIm1haW46anVzdGlmeVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgdG89eycvdXNlci8nICsgYXV0aG9yLmxvZ2lubmFtZX0gY2xhc3NOYW1lPVwibmFtZVwiPnthdXRob3IubG9naW5uYW1lfTwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aW1lIGRhdGEtZmxleC1ib3g9XCIxXCI+e1Rvb2wuZm9ybWF0RGF0ZShjcmVhdGVfYXQpfTwvdGltZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibG91XCI+I+alvOS4uzwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb250XCIgZGF0YS1mbGV4PVwibWFpbjpjZW50ZXIgY3Jvc3M6Y2VudGVyXCI+PFRhYkljb24gey4uLnRoaXMucHJvcHMuc3RhdGUuZGF0YX0gLz48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicXRcIiBkYXRhLWZsZXg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PumYheivu++8mnt2aXNpdF9jb3VudH08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+5Zue5aSN77yae3JlcGx5X2NvdW50fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRpdDJcIj57dGl0bGV9PC9oMj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudCBtYXJrZG93bi1ib2R5XCIgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e2NyZWF0ZU1hcmt1cCgpfSAvPlxyXG4gICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRpdDNcIj7lhbE8ZW0+e3JlcGxpZXMubGVuZ3RofTwvZW0+5p2h5Zue5aSNPC9oMz5cclxuICAgICAgICAgICAgICAgIDxSZUxpc3QgcmVMb2FkRGF0YT17dGhpcy5wcm9wcy5yZUxvYWREYXRhfSBpZD17aWR9IGxpc3Q9e3JlcGxpZXN9IGNsaWNrWmFuPXt0aGlzLnByb3BzLmNsaWNrWmFufSBzaG93UmVwbHlCb3g9e3RoaXMucHJvcHMuc2hvd1JlcGx5Qm94fSBVc2VyPXt0aGlzLnByb3BzLlVzZXJ9IC8+XHJcbiAgICAgICAgICAgICAgICB7Ym90dG9tfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcnRpY2xlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy90b3BpYy9BcnRpY2xlLmpzIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgTmF2TGluayB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5pbXBvcnQgeyBVc2VySGVhZEltZyB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMnO1xyXG5pbXBvcnQgUmVwbHlCb3ggZnJvbSAnLi9SZXBseUJveCc7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tICcuLi8uLi90b29sJztcclxuXHJcbi8vIOWbnuWkjeWIl+ihqFxyXG5jbGFzcyBSZUxpc3QgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIC8vIOmqjOivgeWbnuWkjemhueebruaYr+WQpueCuei1nlxyXG5cclxuICAgICAgICB0aGlzLmlzVXAgPSAoYXJyKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMucHJvcHMuVXNlciA/IHRoaXMucHJvcHMuVXNlci5pZCA6ICcnO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFycltpXSA9PT0gaWQpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBhY2Nlc3N0b2tlbiA9IHRoaXMucHJvcHMuVXNlciA/IHRoaXMucHJvcHMuVXNlci5hY2Nlc3N0b2tlbiA6ICcnO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJyZS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5saXN0Lm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHtpZCwgY29udGVudCwgYXV0aG9yLCB1cHMsIGNyZWF0ZV9hdCwgZGlzcGxheSA9ICdub25lJ30gPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXQgPSBuZXcgRGF0ZShjcmVhdGVfYXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXBTdGF0ZSA9IHRoaXMuaXNVcCh1cHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3JlYXRlTWFya3VwID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfX2h0bWw6IGNvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17aW5kZXh9IGRhdGEtZmxleD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRpbWdcIiBkYXRhLWZsZXgtYm94PVwiMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VXNlckhlYWRJbWcgdXJsPXthdXRob3IuYXZhdGFyX3VybH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1haW5cIiBkYXRhLWZsZXgtYm94PVwiMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtZmxleD1cIm1haW46anVzdGlmeVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgdG89eycvdXNlci8nICsgYXV0aG9yLmxvZ2lubmFtZX0gY2xhc3NOYW1lPVwibmFtZVwiPnthdXRob3IubG9naW5uYW1lfTwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aW1lIGRhdGEtZmxleC1ib3g9XCIxXCI+e1Rvb2wuZm9ybWF0RGF0ZShjcmVhdGVfYXQpfTwvdGltZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibG91XCI+I3srK2luZGV4fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50IG1hcmtkb3duLWJvZHlcIiBkYW5nZXJvdXNseVNldElubmVySFRNTD17Y3JlYXRlTWFya3VwKCl9PjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvdHRvbVwiIGRhdGEtZmxleD1cIm1haW46cmlnaHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgZm9udCBmb250LSR7dXBTdGF0ZX1gfSBvbkNsaWNrPXsoKSA9PiB7IHRoaXMucHJvcHMuY2xpY2taYW4oaWQsIGluZGV4LCBhdXRob3IubG9naW5uYW1lKTsgfSB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb25mb250IGljb24tZGlhbnphbiBcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGVtPnt1cHMubGVuZ3RoID8gdXBzLmxlbmd0aCA6ICcnfTwvZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9udFwiIG9uQ2xpY2s9eygpID0+IHsgdGhpcy5wcm9wcy5zaG93UmVwbHlCb3goaW5kZXgpIH0gfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uZm9udCBpY29uLWh1aWZ1XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UmVwbHlCb3ggcGxhY2Vob2xkZXI9e2BAJHthdXRob3IubG9naW5uYW1lfWB9IHJlTG9hZERhdGE9e3RoaXMucHJvcHMucmVMb2FkRGF0YX0gZGlzcGxheT17ZGlzcGxheX0gbG9naW5uYW1lPXthdXRob3IubG9naW5uYW1lfSBkYXRhPXt7IGFjY2Vzc3Rva2VuLCBpZDogdGhpcy5wcm9wcy5pZCwgcmVwbHlfaWQ6IGlkIH19IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVMaXN0O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy90b3BpYy9SZUxpc3QuanMiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBOYXZMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgYmluZEFjdGlvbkNyZWF0b3JzIH0gZnJvbSAncmVkdXgnO1xyXG5pbXBvcnQgeyBMb2FkaW5nLCBIZWFkZXIgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzJztcclxuaW1wb3J0IEFydGljbGUgZnJvbSAnLi9BcnRpY2xlJztcclxuaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vLi4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tICcuLi8uLi90b29sJztcclxuaW1wb3J0ICcuL2luZGV4Lmxlc3MnO1xyXG5cclxuY2xhc3MgVG9waWMgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgLy/ngrnotZ7miJblj5bmtojotZ5cclxuICAgICAgICB0aGlzLmNsaWNrWmFuID0gKGlkLCBpbmRleCwgbG9naW5uYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBhY2Nlc3N0b2tlbiA9IHRoaXMucHJvcHMuVXNlciA/IHRoaXMucHJvcHMuVXNlci5hY2Nlc3N0b2tlbiA6ICcnO1xyXG4gICAgICAgICAgICB2YXIgdWlkID0gdGhpcy5wcm9wcy5Vc2VyID8gdGhpcy5wcm9wcy5Vc2VyLmlkIDogJyc7XHJcbiAgICAgICAgICAgIGlmICghYWNjZXNzdG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLmhpc3RvcnkucHVzaCh7IHBhdGhuYW1lOiAnL2xvZ2luJyB9KTsgLy/ot7PovazliLDnmbvlvZVcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLlVzZXIubG9naW5uYW1lID09PSBsb2dpbm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhbGVydCgn5L2g5LiN6IO957uZ6Ieq5bex54K56LWeJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgVG9vbC5wb3N0KGAvYXBpL3YxL3JlcGx5LyR7aWR9L3Vwc2AsIHsgYWNjZXNzdG9rZW4gfSwgKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVwcyA9IHRoaXMucHJvcHMuc3RhdGUuZGF0YS5yZXBsaWVzW2luZGV4IC0gMV0udXBzO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5hY3Rpb24gPT0gJ2Rvd24nKSB7IC8v5Y+W5raI54K56LWeXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwc1tpXSA9PT0gdWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBzLnB1c2godWlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5wcm9wcy5zdGF0ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5pi+56S65Zue5aSN5qGGXHJcbiAgICAgICAgdGhpcy5zaG93UmVwbHlCb3ggPSAoaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGFjY2Vzc3Rva2VuID0gdGhpcy5wcm9wcy5Vc2VyID8gdGhpcy5wcm9wcy5Vc2VyLmFjY2Vzc3Rva2VuIDogJyc7XHJcbiAgICAgICAgICAgIGlmICghYWNjZXNzdG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLmhpc3RvcnkucHVzaCh7IHBhdGhuYW1lOiAnL3NpZ25pbicgfSk7IC8v6Lez6L2s5Yiw55m75b2VXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLS1pbmRleDtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuc3RhdGUuZGF0YS5yZXBsaWVzW2luZGV4XS5kaXNwbGF5ID09PSAnYmxvY2snKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnN0YXRlLmRhdGEucmVwbGllc1tpbmRleF0uZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuc3RhdGUuZGF0YS5yZXBsaWVzW2luZGV4XS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnByb3BzLnN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5Zue5aSN5oiQ5Yqf5ZCO77yM6YeN5paw5Yqg6L295pWw5o2uXHJcbiAgICAgICAgdGhpcy5yZUxvYWREYXRhID0gKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5zdGF0ZS5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnByb3BzLnN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSAnL2FwaS92MS8nICsgdGhpcy5wcm9wcy5sb2NhdGlvbi5wYXRobmFtZTtcclxuICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMuZmV0Y2hUb3BpYyh1cmwsIHtcclxuICAgICAgICAgICAgbWRyZW5kZXI6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIge2RhdGEsIGlzRmV0Y2hpbmcsIGlkfSA9IHRoaXMucHJvcHMuc3RhdGU7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wcm9wcy5zdGF0ZSk7XHJcbiAgICAgICAgdmFyIG1haW4gPSBkYXRhID8gPEFydGljbGUgey4uLnRoaXMucHJvcHN9IHJlTG9hZERhdGE9e3RoaXMucmVMb2FkRGF0YX0gY2xpY2taYW49e3RoaXMuY2xpY2taYW59IHNob3dSZXBseUJveD17dGhpcy5zaG93UmVwbHlCb3h9IC8+IDogPExvYWRpbmcgbG9hZEFuaW1hdGlvbj17aXNGZXRjaGluZ30gLz47XHJcbiAgICAgICAgdmFyIGhlYWRlclNldCA9IHtcclxuICAgICAgICAgICAgbGVmdEljb246ICdmYW5odWknLFxyXG4gICAgICAgICAgICBsZWZ0Q2xpY2s6IHRoaXMucHJvcHMuaGlzdG9yeS5nb0JhY2tcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8SGVhZGVyIHsuLi50aGlzLnByb3BzfSB7Li4uaGVhZGVyU2V0fSB0aXRsZT1cIuivpuaDhVwiLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6IFwiNjBweFwifX0+XHJcbiAgICAgICAgICAgICAgICAgICAge21haW59XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChzdGF0ZSA9PiB7XHJcbiAgICByZXR1cm4geyBzdGF0ZTogc3RhdGUuZmV0Y2hUb3BpYyxVc2VyOiBzdGF0ZS5Vc2VyIH1cclxufSwgZGlzcGF0Y2ggPT4ge1xyXG4gICAgcmV0dXJuIHsgYWN0aW9uczogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKSB9XHJcbn0pKFRvcGljKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvdG9waWMvaW5kZXguanMiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBOYXZMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IHF1ZXJ5U3RyaW5nIGZyb20gJ3F1ZXJ5LXN0cmluZyc7XHJcbmltcG9ydCB7IExvYWRpbmcsIEhlYWRlciwgVXNlckhlYWRJbWcgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzJztcclxuaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi4vLi4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tICcuLi8uLi90b29sJztcclxuaW1wb3J0ICcuL2luZGV4Lmxlc3MnO1xyXG5cclxuY2xhc3MgVXNlclZpZXcgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGFiSW5kZXg6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudGFiID0gKHRhYkluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICAgICB0YWJJbmRleDogdGFiSW5kZXhcclxuICAgICAgICAgICAgfSkgO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNpZ25PdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuaGlzdG9yeS5wdXNoKClcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdXNlcm5hbWUgPSB0aGlzLnByb3BzLmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJylbdGhpcy5wcm9wcy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGNvbnN0IHVybCA9ICcvYXBpL3YxL3VzZXIvJyArIHVzZXJuYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5mZXRjaERldGFpbCh1cmwsIHt9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzKTtcclxuICAgICAgICB2YXIge2RhdGEsIGlzRmV0Y2hpbmcsIHRhYkluZGV4fSA9IHRoaXMucHJvcHMuc3RhdGU7XHJcbiAgICAgICAgbGV0IHsgVXNlciwgbWF0Y2h9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsZXQgcGFyYW1zID0gbWF0Y2gucGFyYW1zO1xyXG4gICAgICAgIFVzZXIgPSBVc2VyIHx8IHt9O1xyXG4gICAgICAgIHZhciBtYWluID0gZGF0YSA/IDxIb21lIGRhdGE9e2RhdGF9IHRhYkluZGV4PXt0YWJJbmRleH0gdGFiPXt0aGlzLnRhYn0gdGFiSW5kZXg9e3RoaXMuc3RhdGUudGFiSW5kZXh9IC8+IDogPExvYWRpbmcgbG9hZEFuaW1hdGlvbj17aXNGZXRjaGluZ30gLz47XHJcbiAgICAgICAgdmFyIHRpdGxlID0gcGFyYW1zLmxvZ2lubmFtZSA9PT0gVXNlci5sb2dpbm5hbWUgPyAn5Liq5Lq65Lit5b+DJyA6IHBhcmFtcy5sb2dpbm5hbWUgKyAn55qE5Liq5Lq65Lit5b+DJztcclxuICAgICAgICB2YXIgbGVmdEljb24gPSBwYXJhbXMubG9naW5uYW1lID09PSBVc2VyLmxvZ2lubmFtZSA/IG51bGwgOiAnZmFuaHVpJztcclxuICAgICAgICB2YXIgcmlnaHRJY29uID0gcGFyYW1zLmxvZ2lubmFtZSA9PT0gVXNlci5sb2dpbm5hbWUgPyAndHVpY2h1JyA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxIZWFkZXIgdGl0bGU9e3RpdGxlfSBsZWZ0SWNvbj17bGVmdEljb259IHJpZ2h0SWNvbj17cmlnaHRJY29ufSByaWdodFRvPScvbG9naW4nIC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnNjBweCd9fT5cclxuICAgICAgICAgICAgICAgICAgICB7bWFpbn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8gIOS4quS6uuS4u+mhtVxyXG5jbGFzcyBIb21lIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIge2F2YXRhcl91cmwsIGxvZ2lubmFtZSwgc2NvcmUsIHJlY2VudF90b3BpY3MsIHJlY2VudF9yZXBsaWVzLCBjcmVhdGVfYXR9ID0gdGhpcy5wcm9wcy5kYXRhO1xyXG4gICAgICAgIHZhciB7dGFiSW5kZXh9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICB2YXIgYXJyT24gPSBbXTtcclxuICAgICAgICB2YXIgYXJyRGlzcGxheSA9IFtdO1xyXG4gICAgICAgIGFyck9uW3RhYkluZGV4XSA9ICdvbic7XHJcbiAgICAgICAgYXJyRGlzcGxheVt0YWJJbmRleF0gPSAnYmxvY2snO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXNlci1pbmRleFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkaW1nXCIgZGF0YS1mbGV4PVwiZGlyOnRvcCBtYWluOmNlbnRlciBjcm9zczpjZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8VXNlckhlYWRJbWcgdXJsPXthdmF0YXJfdXJsfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmFtZVwiPntsb2dpbm5hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzY29yZVwiPuenr+WIhu+8mntzY29yZX0mbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDvms6jlhozkuo7vvJp7VG9vbC5mb3JtYXREYXRlKGNyZWF0ZV9hdCl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJ0YWItbmF2XCIgZGF0YS1mbGV4PVwiYm94Om1lYW5cIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgb25DbGljaz17KCkgPT4geyB0aGlzLnByb3BzLnRhYigwKSB9IH0gY2xhc3NOYW1lPXthcnJPblswXX0+5Li76aKYPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgb25DbGljaz17KCkgPT4geyB0aGlzLnByb3BzLnRhYigxKSB9IH0gY2xhc3NOYW1lPXthcnJPblsxXX0+5Zue5aSNPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8SG9tZUxpc3QgbGlzdD17cmVjZW50X3RvcGljc30gZGlzcGxheT17YXJyRGlzcGxheVswXX0gLz5cclxuICAgICAgICAgICAgICAgIDxIb21lTGlzdCBsaXN0PXtyZWNlbnRfcmVwbGllc30gZGlzcGxheT17YXJyRGlzcGxheVsxXX0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8g5Y+R5biD55qE5Li76aKY5ZKM5Zue5aSN55qE5Li76aKY5YiX6KGoXHJcbmNsYXNzIEhvbWVMaXN0IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIge2xpc3QsIGRpc3BsYXl9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibGlzdFwiIHN0eWxlPXt7IGRpc3BsYXk6IGRpc3BsYXkgfX0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB7aWQsIHRpdGxlLCBsYXN0X3JlcGx5X2F0fSA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkga2V5PXtpbmRleH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgZGF0YS1mbGV4PVwiYm94Omxhc3RcIiB0bz17YC90b3BpYy8ke2lkfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdFwiPnt0aXRsZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRpbWUgY2xhc3NOYW1lPntUb29sLmZvcm1hdERhdGUobGFzdF9yZXBseV9hdCl9PC90aW1lPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3Qoc3RhdGUgPT4ge1xyXG4gICAgcmV0dXJuIHsgVXNlcjogc3RhdGUuVXNlciwgc3RhdGU6IHN0YXRlLmZldGNoRGV0YWlsIH1cclxufSwgZGlzcGF0Y2ggPT4ge1xyXG4gICAgcmV0dXJuIHsgYWN0aW9uczogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnMsIGRpc3BhdGNoKSB9XHJcbn0pKFVzZXJWaWV3KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvdXNlci9pbmRleC5qcyIsImltcG9ydCB7VG9vbH0gZnJvbSAnLi4vdG9vbCc7XHJcbi8v6aaW6aG1XHJcbmZ1bmN0aW9uIGZldGNoTGlzdChzdGF0ZSA9IHtpc0ZldGNoaW5nOiBmYWxzZSwgbGlzdHM6IFtdLCBwYWdlOiAxLCBuZXh0QnRuOiB0cnVlLCBsaW1pdDogMTAsIG1kcmVuZGVyOiBmYWxzZSwgdGFiOiAnYWxsJ30sIGFjdGlvbikge1xyXG4gIGxldCBuZXdTdGF0ZSwgbGlzdHMsIHBhZ2UsIHRhYjtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlICdCRUdJTl9GRVRDSF9MSVNUJzpcclxuICAgICAgaWYoc3RhdGUuaXNGZXRjaGluZykgcmV0dXJuIHN0YXRlO1xyXG4gICAgICBpZihzdGF0ZS50YWIgIT09IGFjdGlvbi50YWIpe1xyXG4gICAgICAgIGxpc3RzID0gW107XHJcbiAgICAgICAgdGFiID0gYWN0aW9uLnRhYjtcclxuICAgICAgfWVsc2Uge1xyXG4gICAgICAgIGxpc3RzID0gc3RhdGUubGlzdHM7XHJcbiAgICAgIH1cclxuICAgICAgbmV3U3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgaXNGZXRjaGluZzogdHJ1ZSxcclxuICAgICAgICAgIGxpc3RzOiBsaXN0cyxcclxuICAgICAgICAgIHRhYjogdGFiIHx8IHN0YXRlLnRhYlxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIG5ld1N0YXRlO1xyXG4gICAgY2FzZSAnRkFJTF9GRVRDSF9MSVNUJzpcclxuICAgICAgbmV3U3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcclxuICAgIGNhc2UgJ0RPTkVfRkVUQ0hfTElTVCc6XHJcbiAgICAgIGlmKHN0YXRlLnRhYiAhPT0gYWN0aW9uLnRhYil7XHJcbiAgICAgICAgbGlzdHMgPSBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBwYWdlID0gMjtcclxuICAgICAgICB0YWIgPSBhY3Rpb24udGFiO1xyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgbGlzdHMgPSBzdGF0ZS5saXN0cy5jb25jYXQoYWN0aW9uLnBheWxvYWQpO1xyXG4gICAgICAgIHBhZ2UgPSBzdGF0ZS5wYWdlICsgMTtcclxuICAgICAgfVxyXG4gICAgICBuZXdTdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXHJcbiAgICAgICAgbGlzdHM6IGxpc3RzLFxyXG4gICAgICAgIHBhZ2U6IHBhZ2UsXHJcbiAgICAgICAgdGFiOiB0YWIgfHwgc3RhdGUudGFiXHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZVxyXG4gIH1cclxufVxyXG4vL+ivpuaDhVxyXG5mdW5jdGlvbiBmZXRjaFRvcGljKHN0YXRlID0ge2lzRmV0Y2hpbmc6IGZhbHNlLCBkYXRhOm51bGx9LCBhY3Rpb24pe1xyXG4gIGxldCBuZXdTdGF0ZTtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlICdCRUdJTl9GRVRDSF9UT1BJQyc6XHJcbiAgICAgIG5ld1N0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICBpc0ZldGNoaW5nOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gbmV3U3RhdGU7XHJcbiAgICBjYXNlICdET05FX0ZFVENIX1RPUElDJzpcclxuICAgICAgbmV3U3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxyXG4gICAgICAgIGRhdGE6IGFjdGlvbi5wYXlsb2FkXHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZVxyXG4gIH1cclxufVxyXG4vL+WPkeihqFxyXG5mdW5jdGlvbiBjcmVhdGVUb3BpYyhzdGF0ZSA9IHtpc0ZldGNoaW5nOiBmYWxzZSwgZGF0YTpudWxsfSwgYWN0aW9uKXtcclxuICBsZXQgbmV3U3RhdGU7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSAnQkVHSU5fQ1JFQVRFX1RPUElDJzpcclxuICAgICAgbmV3U3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgIGlzRmV0Y2hpbmc6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcclxuICAgIGNhc2UgJ0RPTkVfQ1JFQVRFX1RPUElDJzpcclxuICAgICAgbmV3U3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxyXG4gICAgICAgIGRhdGE6IGFjdGlvbi5wYXlsb2FkXHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZVxyXG4gIH1cclxufVxyXG5cclxuLy/mtojmga9cclxuZnVuY3Rpb24gZmV0Y2hNZXNzYWdlKHN0YXRlID0ge2lzRmV0Y2hpbmc6IGZhbHNlLCBkYXRhOm51bGx9LCBhY3Rpb24pe1xyXG4gIGxldCBuZXdTdGF0ZTtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlICdCRUdJTl9GRVRDSF9NRVNTQUdFJzpcclxuICAgICAgbmV3U3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgIGlzRmV0Y2hpbmc6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcclxuICAgIGNhc2UgJ0RPTkVfRkVUQ0hfTUVTU0FHRSc6XHJcbiAgICAgIG5ld1N0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcclxuICAgICAgICBkYXRhOiBhY3Rpb24ucGF5bG9hZFxyXG4gICAgICB9KVxyXG4gICAgICByZXR1cm4gbmV3U3RhdGU7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGVcclxuICB9XHJcbn1cclxuXHJcbi8v55m75b2VXHJcbi8vIGNvbnNvbGUubG9nKFRvb2wuZ2V0T3JTZXRJdGVtKCd1c2VyJykpO1xyXG5mdW5jdGlvbiBsb2dpbihzdGF0ZSA9IFRvb2wuZ2V0T3JTZXRJdGVtKCd1c2VyJyksIGFjdGlvbil7XHJcbiAgbGV0IG5ld1N0YXRlO1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgJ0xPR0lOX0lOX1NVQ0NFU1MnOlxyXG4gICAgICBUb29sLmdldE9yU2V0SXRlbSgndXNlcicsIGFjdGlvbi5wYXlsb2FkKTtcclxuICAgICAgbmV3U3RhdGUgPSBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgcmV0dXJuIG5ld1N0YXRlO1xyXG4gICAgY2FzZSAnTE9HSU5fT1VUJzpcclxuICAgICAgVG9vbC5yZW1vdmVJdGVtKCd1c2VyJyk7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlXHJcbiAgfVxyXG59XHJcblxyXG4vL+S4quS6uuS4reW/g1xyXG5mdW5jdGlvbiBmZXRjaERldGFpbChzdGF0ZSA9IHtpc0ZldGNoaW5nOiBmYWxzZSwgZGF0YTpudWxsfSwgYWN0aW9uKXtcclxuICBsZXQgbmV3U3RhdGU7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSAnQkVHSU5fRkVUQ0hfREVUQUlMJzpcclxuICAgICAgbmV3U3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgIGlzRmV0Y2hpbmc6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcclxuICAgIGNhc2UgJ0RPTkVfRkVUQ0hfREVUQUlMJzpcclxuICAgICAgbmV3U3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxyXG4gICAgICAgIGRhdGE6IGFjdGlvbi5wYXlsb2FkXHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZVxyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBmZXRjaExpc3Q6IGZldGNoTGlzdCxcclxuICBmZXRjaFRvcGljOiBmZXRjaFRvcGljLFxyXG4gIGNyZWF0ZVRvcGljOiBjcmVhdGVUb3BpYyxcclxuICBmZXRjaE1lc3NhZ2U6IGZldGNoTWVzc2FnZSxcclxuICBVc2VyOiBsb2dpbixcclxuICBmZXRjaERldGFpbDogZmV0Y2hEZXRhaWxcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcmVkdWNlci9pbmRleC5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IE5hdkxpbmssIFJvdXRlciwgUm91dGUsIFN3aXRjaCwgaGFzaEhpc3RvcnksIFJlZGlyZWN0IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCBjcmVhdGVCcm93c2VySGlzdG9yeSBmcm9tICdoaXN0b3J5L2NyZWF0ZUJyb3dzZXJIaXN0b3J5JztcclxuaW1wb3J0IGNyZWF0ZUhhc2hIaXN0b3J5IGZyb20gJ2hpc3RvcnkvY3JlYXRlSGFzaEhpc3RvcnknO1xyXG5pbXBvcnQgSW5kZXggZnJvbSAnLi4vcGFnZXMnO1xyXG5pbXBvcnQgVG9waWMgZnJvbSAnLi4vcGFnZXMvdG9waWMnO1xyXG5pbXBvcnQgTG9naW4gZnJvbSAnLi4vcGFnZXMvbG9naW4nO1xyXG5cclxuY29uc3QgaGlzdG9yeSA9IGNyZWF0ZUhhc2hIaXN0b3J5KCk7XHJcblxyXG5mdW5jdGlvbiBSb3V0ZXMoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxSb3V0ZXIgaGlzdG9yeT17aGlzdG9yeX0+XHJcbiAgICAgICAgICAgIDxTd2l0Y2g+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD0nL2xvZ2luJyBjb21wb25lbnQ9e0xvZ2lufS8+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD0nL3RvcGljLzppZD8nIGNvbXBvbmVudD17VG9waWN9IC8+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD0nLycgY29tcG9uZW50PXtJbmRleH0gLz5cclxuICAgICAgICAgICAgICAgIDxSZWRpcmVjdCBmcm9tPScnIHRvPVwiL1wiIC8+XHJcbiAgICAgICAgICAgIDwvU3dpdGNoPlxyXG4gICAgICAgIDwvUm91dGVyPlxyXG4gICAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUm91dGVzO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yb3V0ZS9pbmRleC5qcyIsImltcG9ydCB7IGNyZWF0ZVN0b3JlLCBjb21iaW5lUmVkdWNlcnMsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IFJlZHVjZXIgZnJvbSAnLi4vcmVkdWNlcic7XHJcbmltcG9ydCB0aHVuayBmcm9tICdyZWR1eC10aHVuayc7XHJcblxyXG52YXIgc3RvcmUgPSBjcmVhdGVTdG9yZShcclxuICAgIGNvbWJpbmVSZWR1Y2VycyhSZWR1Y2VyKSxcclxuICAgIGFwcGx5TWlkZGxld2FyZSh0aHVuaylcclxuKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0b3JlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdG9yZS9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImljb25mb250LnN2Z1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ljb25mb250L2ljb25mb250LnN2Z1xuLy8gbW9kdWxlIGlkID0gNjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaWNvbmZvbnQudHRmXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaWNvbmZvbnQvaWNvbmZvbnQudHRmXG4vLyBtb2R1bGUgaWQgPSA2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJpY29uZm9udC53b2ZmXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaWNvbmZvbnQvaWNvbmZvbnQud29mZlxuLy8gbW9kdWxlIGlkID0gNjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9kYXRhLWZsZXguY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9kYXRhLWZsZXguY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vZGF0YS1mbGV4LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZsZXguY3NzL2Rpc3QvZGF0YS1mbGV4LmNzc1xuLy8gbW9kdWxlIGlkID0gNjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9naXRodWItbWFya2Rvd24uY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9naXRodWItbWFya2Rvd24uY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vZ2l0aHViLW1hcmtkb3duLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2dpdGh1Yi1tYXJrZG93bi1jc3MvZ2l0aHViLW1hcmtkb3duLmNzc1xuLy8gbW9kdWxlIGlkID0gNjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9ub3JtYWxpemUuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9ub3JtYWxpemUuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vbm9ybWFsaXplLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzc1xuLy8gbW9kdWxlIGlkID0gNjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL2ljb25mb250LmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vaWNvbmZvbnQuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9pY29uZm9udC5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ljb25mb250L2ljb25mb250LmNzc1xuLy8gbW9kdWxlIGlkID0gNjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTItMiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5sZXNzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yLTIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMi0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvSGVhZGVyL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDY4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yLTIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMi0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTItMiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5sZXNzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL0xvYWRpbmcvaW5kZXgubGVzc1xuLy8gbW9kdWxlIGlkID0gNjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTItMiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5sZXNzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yLTIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMi0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhZ2VzL2NyZWF0ZS9pbmRleC5sZXNzXG4vLyBtb2R1bGUgaWQgPSA3MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMi0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTItMiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5sZXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yLTIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFnZXMvaG9tZS9pbmRleC5sZXNzXG4vLyBtb2R1bGUgaWQgPSA3MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMi0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTItMiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5sZXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yLTIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFnZXMvbG9naW4vaW5kZXgubGVzc1xuLy8gbW9kdWxlIGlkID0gNzJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTItMiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5sZXNzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yLTIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMi0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhZ2VzL3RvcGljL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDczXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yLTIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMi0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTItMiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5sZXNzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYWdlcy91c2VyL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDc0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLTEhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yLTIhLi4vLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUubGVzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi0xIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMi0yIS4uLy4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmxlc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItMSEuLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTItMiEuLi8uLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5sZXNzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZS9zdHlsZS5sZXNzXG4vLyBtb2R1bGUgaWQgPSA3NVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9