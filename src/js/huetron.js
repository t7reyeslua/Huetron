var app = angular.module('huetronApp', ['huetron.utils', 'ui.bootstrap', 'nouislider', 'xeditable']);


app.controller('lightsCtrl', function($scope){
    $scope.$watch('l1.brightness', function (newValue, oldValue) {
        if ($scope.data.lights[$scope.key].on == true) {
            console.log(' brightness watch fired, new value: ' + newValue);
            var id = $scope.data.lights[$scope.key].id;
            $scope.updateLightConfig(id, {brightness: newValue}, false);
        }
    });
    $scope.$watch('l1.saturation', function (newValue, oldValue) {
        if ($scope.data.lights[$scope.key].on == true) {
            console.log('saturation watch fired, new value: ' + newValue);
            var id = $scope.data.lights[$scope.key].id;
            $scope.updateLightConfig(id, {saturation: newValue}, false);
        }
    });
    $scope.$watch('l1.hue', function (newValue, oldValue) {
        if ($scope.data.lights[$scope.key].on == true) {
            console.log('hue watch fired, new value: ' + newValue);
            var id = $scope.data.lights[$scope.key].id;
            $scope.updateLightConfig(id, {hue: newValue}, false);
        }
    });

});
app.controller('groupsCtrl', function($scope){
    $scope.$watch('l1.brightness', function (newValue, oldValue) {
        if ($scope.data.groups[$scope.key].on == true) {
            console.log(' brightness watch fired, new value: ' + newValue);
            var id = $scope.data.groups[$scope.key].id;
            $scope.updateGroupConfig(id, {brightness: newValue}, false);
        }
    });
    $scope.$watch('l1.saturation', function (newValue, oldValue) {
        if ($scope.data.groups[$scope.key].on == true) {
            console.log('saturation watch fired, new value: ' + newValue);
            var id = $scope.data.groups[$scope.key].id;
            $scope.updateGroupConfig(id, {saturation: newValue}, false);
        }
    });
    $scope.$watch('l1.hue', function (newValue, oldValue) {
        if ($scope.data.groups[$scope.key].on == true) {
            console.log('hue watch fired, new value: ' + newValue);
            var id = $scope.data.groups[$scope.key].id;
            $scope.updateGroupConfig(id, {hue: newValue}, false);
        }
    });
});

app.controller('scenesCtrl', function($scope){

});


app.controller('huetronCtrl', function($scope, $http, $q, Snackbar, $interval) {
    init();
    function init() {
        $scope.flags = {};
        $scope.flags.bridgeFound = false;
        $scope.flags.bridgeSearching = false;
        $scope.flags.bridgeWaitingButtonPush = false;
        $scope.flags.bridgeConnected = false;
        $scope.flags.userSelected = false;
        $scope.flags.savingScene = false;
        $scope.client = null;

        $scope.data = {};
        $scope.data.bridgeCredentials = null;
        $scope.data.bridgeConfig = null;
        $scope.data.lights = [];
        $scope.data.groups = [];
        $scope.data.scenes = [];
        $scope.data.schedules = [];
        $scope.data.newSceneName = null;


        $scope.tabs_index = 0;
        $scope.tabs = [
            {title: "Scenes", icon: "fa fa-eye"},
            {title: "Groups", icon: "fa fa-th-large"},
            {title: "Lights", icon: "fa fa-lightbulb-o"},
            // {title: "Schedules", icon: "fa fa-clock-o"},
            {title: "Music", icon: "fa fa-music"}
            // {title: "Settings", icon: "fa fa-cog"}
        ];
        //getBridgeCredentials();
        // var storage = require('electron-json-storage');
        // username = "beautifulhuetest";
        // host = "192.168.178.10";
        // storage.set('hueCredentials', { host: host, username: username }, function(error) {
        //     if (error) throw error;
        // });
    }


    // TABS=============================================================================================================
    $scope.moveTabs = function (increment){
        $scope.flags.enableUpdates = false;
        var index = $scope.tabs_index;
        if (increment == true){
            index += 1;
            if (index == $scope.tabs.length) {
                index = 0;
            }
        } else {
            index -= 1;
            if (index < 0){
                index = $scope.tabs.length -1;
            }
        }
        $scope.tabs_index = index;
        $scope.flags.enableUpdates = true;
    };

    // GENERAL==========================================================================================================
    $scope.getBridgeConfig = function(){
        $scope.client.bridge.get()
            .then(bridge => {
                console.log(`Retrieved bridge ${bridge.name}`);
                console.log('  Id:', bridge.id);
                console.log('  Model Id:', bridge.model.id);
                console.log('  Model Name:', bridge.model.name);
                console.log('  API Version:', bridge.apiVersion);
                $scope.$apply(function(){
                    $scope.data.bridgeConfig = bridge;
                });
            });
    };

    $scope.setBridgeConfig = function(bridgeConfig){
        $scope.client.bridge.save(bridgeConfig);
    };

    // LIGHTS===========================================================================================================
    $scope.getAllLights = function(){
        $scope.client.lights.getAll()
            .then(lights => {
                for (let light of lights) {
                }
                console.log(lights);
                $scope.$apply(function(){
                    $scope.data.lights = lights;
                });

                return lights;
            });
    };
    // $scope.$watch('data.lights', $scope.updateBrightness, true);

    $scope.sliderBrightness = function (light) {
        console.warn(light.brightness);
    };

    $scope.updateLightConfig = function(lightid, lightConfig, updateLists){
        $scope.client.lights.getById(lightid)
            .then(light => {
                for(var k in lightConfig){
                    light[k]=lightConfig[k];
                }
                var temp = $scope.client.lights.save(light);
                if (updateLists == true) {
                    $scope.getAllLights();
                    $scope.getAllGroups();
                }
                return temp
            })
            .then(light => {
                console.log(`Updated light [${light.id}]`);
            })
            .catch(error => {
                console.log('Something went wrong');
                console.log(error.stack);
            });
    };

    // GROUPS===========================================================================================================
    $scope.getAllGroups = function(){
        $scope.client.groups.getAll()
            .then(groups => {
                for (let group of groups) {
                    // group.lights = $scope.getGroupLights(group);
                }
                console.log(groups);
                $scope.client.groups.getById(0)
                    .then(group => {
                        // group.lights = $scope.getGroupLights(group);
                        group.name = "All";
                        groups.push(group);
                        $scope.$apply(function(){
                            $scope.data.groups = groups;
                        });
                    });


            });
    };

    $scope.getGroup = function(groupid){
        $scope.client.groups.getById(groupid)
            .then(group => {
                console.log('Found group:');
                console.log(`  Group [${group.id}]: ${group.name}`);
            })
            .catch(error => {
                console.log('Could not find group');
                console.log(error.stack);
            });
    };

    $scope.createGroup = function(groupids, groupname){
        let group = new $scope.client.groups.Group;
        group.name     = groupname;
        group.lightIds = groupids;

        $scope.client.groups.create(group)
            .then(group => {
                console.log(`Group [${group.id}] created`);
            })
            .catch(error => {
                console.log(error.stack);
            });
    };

    $scope.deleteGroup = function(groupid){
        $scope.client.groups.delete(groupid)
            .then(() => {
                console.log('Group was deleted');
            })
            .catch(error => {
                console.log('Group may have been removed already, or does not exist');
                console.log(error.stack);
            });
    };

    $scope.updateGroupConfig = function(groupid, groupConfig, updateLists){
        $scope.client.groups.getById(groupid)
            .then(group => {
                for(var k in groupConfig){
                    group[k] = groupConfig[k];
                }
                var temp =  $scope.client.groups.save(group);
                if (updateLists == true) {
                    $scope.getAllGroups();
                    $scope.getAllLights();
                }
                return temp
            })
            .then(group => {
                console.log(`Group [${group.id}] was saved`);
            })
            .catch(error => {
                console.log(error.stack);
            });
    };

    $scope.getGroupLights = function(group){
        var groupLights = [];
        group.lightIds.forEach(function(lightid){
            $scope.client.lights.getById(lightid)
                .then(light => {
                    console.log(group.name + "|" + `  Light [${light.id}]: ${light.name}`);
                    groupLights.push(light);
                })
                .catch(error => {
                    console.log('Could not find light');
                    console.log(error.stack);
                });
        });
        return groupLights
    };

    // SCENES===========================================================================================================
    $scope.saveSceneControls = function(enable){
        $scope.data.newSceneName = null;
        $scope.flags.savingScene = enable;
    };
    $scope.editSceneControls = function(scene){
        if (scene.editControls == null || scene.editControls == "undefined"){
            scene.editControls = true;
        } else {
            scene.editControls = !scene.editControls;
        }        
    };

    $scope.getAllScenes = function(){
        $scope.client.scenes.getAll()
            .then(scenes => {
                for (let scene of scenes) {}
                console.log(scenes);
                scenes.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
                $scope.$apply(function(){
                    $scope.data.scenes = scenes;
                });
            });
    };
    $scope.deleteScene = function(sceneid){
        $scope.client.scenes.delete(sceneid)
            .then(() => {
                console.log('Scene was deleted');
                $scope.getAllScenes();
            })
            .catch(error => {
                console.log('Scene may have been removed already, or does not exist');
                console.log(error.stack);
            });
    };
    $scope.recallScene = function(sceneid){
        $scope.client.scenes.recall(sceneid)
            .then(() => {
                console.log('Scene was recalled');
            })
            .catch(error => {
                console.log(error.stack);
            });
    };
    $scope.updateSceneConfig = function(sceneid, sceneConfig, updateLists){
        $scope.client.scenes.getById(sceneid)
            .then(scene => {

                for(var k in sceneConfig){
                    scene[k] = sceneConfig[k];
                }

                var temp = $scope.client.scenes.save(scene);
                if (updateLists == true) {
                    $scope.getAllScenes();
                }
                return temp
            })
            .then(scene => {
                console.log(`Scene saved...`);
            })
            .catch(error => {
                console.log(error.stack);
            });
    };

    $scope.saveNewScene = function() {
        console.log("saving new scene");
        console.log($scope.data.newSceneName);

        if ($scope.data.newSceneName == null){
            Snackbar.show("Please choose a scene name");
            return
        }

        let scene = new $scope.client.scenes.Scene;
        scene.name           = $scope.data.newSceneName;
        scene.lightIds       = [];
        scene.recycle        = false;

        $scope.data.lights.forEach(function(item){
            if (item.selected == true){
                console.warn(item.name);
                scene.lightIds.push(item.id);
                scene.setLightState(item.id, {
                    brightness: item.brightness,
                    hue: item.hue,
                    saturation: item.saturation
                });
            }
        });

        $scope.client.scenes.create(scene)
            .then(scene => {
                console.log(`Scene [${scene.id}] created...`);
                $scope.getAllScenes();
                $scope.flags.savingScene = false;
            })
            .catch(error => {
                console.log(error.stack);
            });

    };

    // USERS============================================================================================================
    $scope.getAllUsers = function (){
        $scope.client.users.getAll()
            .then(users => {
                for (let user of users) {
                    // console.log(`Username: ${user.username}`);
                }
            });
    };

    $scope.getAuthenticatedUser = function (){
        $scope.client.users.get()
            .then(user => {
                console.log('Username:', user.username);
                console.log('Device type:', user.deviceType);
                console.log('Create date:', user.created);
                console.log('Last use date:', user.lastUsed);
            });
    };

    $scope.getUser = function (username){
        $scope.client.users.getByUsername(username)
            .then(user => {
                console.log(`Username: ${user.username}`);
            })
            .catch(error => {
                console.log(error.stack);
            });
    };

    $scope.deleteUser = function(username){
        $scope.client.users.delete('usernamehere')
            .then(() => {
                console.log('User was deleted');
            })
            .catch(error => {
                console.log(error.stack);
            });
    };

    // SCHEDULES========================================================================================================
    $scope.getAllSchedules = function(){
        $scope.client.schedules.getAll()
            .then(schedules => {
                for (let schedule of schedules) {}
                console.log(schedules);
                $scope.$apply(function(){
                    $scope.data.schedules = schedules;
                });
            });
    };

    // OTHER============================================================================================================
    function startMonitoring() {
        $interval(function () {
            $scope.getAllLights();
        }, 5000);
        $interval(function () {
            $scope.getAllGroups();
        }, 5000);
    }

    function getBridgeCredentials(){
        var storage = require('electron-json-storage');
        storage.get('hueCredentials', function(error, data) {
            if (error) throw error;
            var size = Object.keys(data).length;
            if (size == 0){
                console.log("No stored credentials found");
                discoverBridges();
            } else {
                console.info("Bridge credentials found");
                console.log(data);
                $scope.data.bridgeCredentials = data;
                instantiateClient(data.host, data.username);
            }
        });
    }
    $scope.getBridgeCreds = getBridgeCredentials();

    function discoverBridges(){
        huejay.discover()
            .then(bridges => {
                $scope.bridges = bridges;
                for (let bridge of bridges) {
                    console.log(`Id: ${bridge.id}, IP: ${bridge.ip}`);
                }
                createUser(bridges[0].ip);
            })
            .catch(error => {
                console.log(`An error occurred: ${error.message}`);
            });

    }

    function instantiateClient(ip, username){
        var clientOptions = {};
        clientOptions.host = ip;
        clientOptions.username = username;
        $scope.client = new huejay.Client(clientOptions);
        $scope.client.bridge.isAuthenticated()
            .then(() => {
                console.log('Successful authentication');
                // Snackbar.show('Successful authentication');
                $scope.$apply(function(){
                    $scope.flags.bridgeConnected = true;
                });
                $scope.getBridgeConfig();
                $scope.getAllUsers();
                $scope.getAllLights();
                $scope.getAllGroups();
                $scope.getAllScenes();
                $scope.getAllSchedules();
                //startMonitoring();
            })
            .catch(error => {
                console.log('Could not authenticate');
                Snackbar.show('Could not authenticate');
            });
    }

    function createUser(ip){
        var clientOptions = {host : ip};
        var client = new huejay.Client(clientOptions);
        var user = new client.users.User;
        console.log(client);
        // Optionally configure a device type / agent on the user
        user.deviceType = 'huetron';
        client.users.create(user)
            .then(user => {
                Snackbar.show(`New user created - Username: ${user.username}`);
                console.log(user);
                saveBridgeCredentials(ip, user.username);
                instantiateClient(ip, user.username);
            })
            .catch(error => {
                if (error instanceof huejay.Error && error.type === 101) {
                    console.error(`Link button not pressed. Try again...`);
                }

                Snackbar.error(`Link button not pressed. Try again...`);
                console.log(error.stack);
            });
    }

    function saveBridgeCredentials(host, username){
        var storage = require('electron-json-storage');
        storage.set('hueCredentials', { host: host, username: username }, function(error) {
            if (error) throw error;
        });
    }

});

