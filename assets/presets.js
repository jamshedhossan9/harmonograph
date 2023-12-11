/*
    "Harmonograph" is a Javascript written project that simulates drawing of a harmonograph. It generates geometric drawings based on inputs.
    
    Copyright (C) 2023 - Jamshed Hossan

    This program is free software: you can redistribute it and/or modify it under the terms 
    of the GNU General Public License as published by the Free Software Foundation, 
    either version 3 of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
    without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
    PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with this program. 
    If not, see https://www.gnu.org/licenses/.
*/

var presetConfig = {};
var presetOrder = [
    31, 32, 34, 33, 28, 27,
    1, 4, 29, 5, 30, 2, 3, 6, 7, 19, 18, 20, 15, 8, 9, 10,
    11, 12, 
    21, 22, 23, 24, 25, 26, 13, 14, 16, 17,
];

function loadPresets(){
    var html = ``;
    for(let i = 0; i < presetOrder.length; i++){
        html += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                <div class="preset_element" data-id="${presetOrder[i]}">
                    <img class="w-100 preset_element_image" src="./assets/presets/preset${presetOrder[i]}.png" alt="Preset ${presetOrder[i]}">
                </div>
            </div>
        `;
    }
    document.querySelector('.preset_drawings_container').innerHTML = html;
}

function setPreset(index){
    stop();
    
    if(presetConfig[index]){
        canvas.context.clearRect(0, 0, canvas.el.width, canvas.el.height);
        logStartPosition(false);
        cacheToSetting(presetConfig[index]);
        setValueToInputs();
        turnMotor(true);
        setMachineAndGear();
        setColor();
        presetModal.hide();
    }
    else{
        alert('Sorry, Preset not found in config.');
    }
}

function addToPresetConfig(index, config){
    presetConfig[index] = config;
}

addToPresetConfig(1, {
    color:{
        start: '#d01516',
        end: '#d01516',
    },
    machine: {
        gear: {
            0: {
                deg: 315,
                wallDistance: 22,
                parent: {
                    dir: 1,
                    speed: 74,
                    deg: 0,
                    size: 10,
                },
                child: {
                    dir: 1,
                    speed: 2,
                    deg: 0,
                    size: 69.5,
                    conDeg: 0,
                },
            },
            1: {
                deg: 171,
                wallDistance: 40,
                parent: {
                    dir: -1,
                    speed: 120,
                    deg: 0,
                    size: 19,
                },
                child: {
                    dir: -1,
                    speed: 2,
                    deg: 0,
                    size: 44.5,
                    conDeg: 0,
                },
            },
        },
        hand: {
            arm: {
                length: 36,
            },
            forearm:{
                length: 10,
            },
            palm:{
                length: 100,
            }
        },
    }
});
addToPresetConfig(2, {
    color:{
        start: '#d01516',
        end: '#d01516',
    },
    machine: {
        gear: {
            0: {
                deg: 73,
                wallDistance: 26,
                parent: {
                    dir: 1,
                    speed: 74,
                    deg: 0,
                    size: 17,
                },
                child: {
                    dir: 1,
                    speed: 2,
                    deg: 0,
                    size: 52,
                    conDeg: 0,
                },
            },
            1: {
                deg: 64,
                wallDistance: 30,
                parent: {
                    dir: -1,
                    speed: 116,
                    deg: 0,
                    size: 17,
                },
                child: {
                    dir: -1,
                    speed: 2,
                    deg: 0,
                    size: 37.5,
                    conDeg: 0,
                },
            },
        },
        hand: {
            arm: {
                length: 21,
            },
            forearm:{
                length: 10,
            },
            palm:{
                length: 100,
            }
        },
    }
});
addToPresetConfig(3, presetConfig[2]);
addToPresetConfig(4, {
    "color": {
        "start": "#000000",
        "end": "#000000"
    },
    "canvas": {
        "accuracy": 1
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 206,
                "wallDistance": 30,
                "parent": {
                    "dir": 1,
                    "speed": 239,
                    "size": 13.5
                },
                "child": {
                    "dir": -1,
                    "speed": 2,
                    "size": 60,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 260,
                "wallDistance": 36,
                "parent": {
                    "dir": -1,
                    "speed": 182,
                    "size": 18
                },
                "child": {
                    "dir": 1,
                    "speed": 3,
                    "size": 80,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 30
            },
            "forearm": {
                "length": 30
            },
            "palm": {
                "length": 103
            }
        }
    }
});
addToPresetConfig(5, {
    "canvas": {
        "accuracy": 1
    },
    color:{
        start: '#000000',
        end: '#000000',
    },
    machine: {
        gear: {
            0: {
                deg: 206,
                wallDistance: 30,
                parent: {
                    dir: -1,
                    speed: 239,
                    deg: 0,
                    size: 14,
                },
                child: {
                    dir: 1,
                    speed: 1,
                    deg: 0,
                    size: 80,
                    conDeg: 0,
                },
            },
            1: {
                deg: 260,
                wallDistance: 36,
                parent: {
                    dir: 1,
                    speed: 104,
                    deg: 0,
                    size: 22,
                },
                child: {
                    dir: -1,
                    speed: 1,
                    deg: 0,
                    size: 73.5,
                    conDeg: 0,
                },
            },
        },
        hand: {
            arm: {
                length: 30,
            },
            forearm:{
                length: 30,
            },
            palm:{
                length: 103,
            }
        },
    }
});
addToPresetConfig(6, {
    "canvas": {
        "accuracy": 6
    },
    "color": {
      "start": "#098b8d",
      "end": "#098b8d"
    },
    "machine": {
      "gear": {
        "0": {
          "deg": 29,
          "wallDistance": 25,
          "parent": {
            "dir": -1,
            "speed": 76,
            "size": 14.5
          },
          "child": {
            "dir": -1,
            "speed": 1,
            "size": 61,
            "conDeg": 170
          }
        },
        "1": {
          "deg": 177,
          "wallDistance": 31,
          "parent": {
            "dir": -1,
            "speed": 129,
            "size": 14
          },
          "child": {
            "dir": -1,
            "speed": 1,
            "size": 34,
            "conDeg": 80
          }
        }
      },
      "hand": {
        "arm": {
          "length": 5
        },
        "forearm": {
          "length": 10
        },
        "palm": {
          "length": 100
        }
      }
    }
});
addToPresetConfig(7, presetConfig[6]);
addToPresetConfig(8, {
    "color": {
        "start": "#0f2870",
        "end": "#0f2870"
    },
    "canvas": {
        "accuracy": 2
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 360,
                "wallDistance": 25,
                "parent": {
                    "dir": 1,
                    "speed": 36,
                    "size": 13.5
                },
                "child": {
                    "dir": 1,
                    "speed": 1,
                    "size": 42.5,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 99,
                "wallDistance": 29,
                "parent": {
                    "dir": -1,
                    "speed": 300,
                    "size": 14
                },
                "child": {
                    "dir": -1,
                    "speed": 1,
                    "size": 20,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(9, presetConfig[8]);
addToPresetConfig(10, presetConfig[8]);
addToPresetConfig(11, presetConfig[8]);
addToPresetConfig(12, presetConfig[8]);
addToPresetConfig(13, {
    "color": {
        "start": "#000000",
        "end": "#000000"
    },
    "canvas": {
        "accuracy": 1
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 325,
                "wallDistance": 25,
                "parent": {
                    "dir": 1,
                    "speed": 177,
                    "size": 11
                },
                "child": {
                    "dir": 1,
                    "speed": 1,
                    "size": 61,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 199,
                "wallDistance": 31,
                "parent": {
                    "dir": -1,
                    "speed": 1,
                    "size": 11
                },
                "child": {
                    "dir": -1,
                    "speed": 3,
                    "size": 43,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 8
            },
            "forearm": {
                "length": 31
            },
            "palm": {
                "length": 127
            }
        }
    }
});
addToPresetConfig(14, presetConfig[13]);
addToPresetConfig(15, {
    "color": {
        "start": "#d00101",
        "end": "#d00101"
    },
    "canvas": {
        "accuracy": 1
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 226,
                "wallDistance": 26,
                "parent": {
                    "dir": -1,
                    "speed": 239,
                    "size": 10.5
                },
                "child": {
                    "dir": 1,
                    "speed": 2,
                    "size": 47.5,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 240,
                "wallDistance": 36,
                "parent": {
                    "dir": 1,
                    "speed": 182,
                    "size": 6.5
                },
                "child": {
                    "dir": -1,
                    "speed": 3,
                    "size": 60,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 30
            },
            "forearm": {
                "length": 43
            },
            "palm": {
                "length": 130
            }
        }
    }
});
addToPresetConfig(16, {
    "color": {
        "start": "#000000",
        "end": "#000000"
    },
    "canvas": {
        "accuracy": 1
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 325,
                "wallDistance": 28,
                "parent": {
                    "dir": 1,
                    "speed": 148,
                    "size": 12
                },
                "child": {
                    "dir": 1,
                    "speed": 1,
                    "size": 56,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 139,
                "wallDistance": 39,
                "parent": {
                    "dir": 1,
                    "speed": 3,
                    "size": 11
                },
                "child": {
                    "dir": -1,
                    "speed": 3,
                    "size": 43,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 8
            },
            "forearm": {
                "length": 50
            },
            "palm": {
                "length": 100
            }
        }
    }
});

addToPresetConfig(17, {
    "color": {
        "start": "#000000",
        "end": "#000000"
    },
    "canvas": {
        "accuracy": 1
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 325,
                "wallDistance": 28,
                "parent": {
                    "dir": 1,
                    "speed": 165,
                    "size": 12
                },
                "child": {
                    "dir": 1,
                    "speed": 1,
                    "size": 56,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 139,
                "wallDistance": 39,
                "parent": {
                    "dir": -1,
                    "speed": 3,
                    "size": 11
                },
                "child": {
                    "dir": -1,
                    "speed": 3,
                    "size": 43,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 8
            },
            "forearm": {
                "length": 50
            },
            "palm": {
                "length": 130
            }
        }
    }
});
addToPresetConfig(18, {
    "color": {
        "start": "#f9539b",
        "end": "#f9539b",
        "opacity": 0.1
    },
    "canvas": {
        "accuracy": 4
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 168,
                "wallDistance": 30,
                "parent": {
                    "dir": 1,
                    "speed": 100,
                    "size": 12
                },
                "child": {
                    "dir": -1,
                    "speed": 0.2,
                    "size": 50,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 118,
                "wallDistance": 30,
                "parent": {
                    "dir": -1,
                    "speed": 160,
                    "size": 12
                },
                "child": {
                    "dir": -1,
                    "speed": 0.2,
                    "size": 50,
                    "conDeg": 52
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 100
            }
        }
    }
})
addToPresetConfig(19, {
    "color": {
        "start": "#6715cb",
        "end": "#6715cb",
        "opacity": .3,
    },
    "canvas": {
        "accuracy": 4
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 168,
                "wallDistance": 30,
                "parent": {
                    "dir": 1,
                    "speed": 100,
                    "size": 12
                },
                "child": {
                    "dir": -1,
                    "speed": 1,
                    "size": 50,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 118,
                "wallDistance": 30,
                "parent": {
                    "dir": -1,
                    "speed": 160,
                    "size": 12
                },
                "child": {
                    "dir": -1,
                    "speed": 1,
                    "size": 50,
                    "conDeg": 52
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 100
            }
        }
    }
})
addToPresetConfig(20, {
    "color": {
        "start": "#6715cb",
        "end": "#6715cb",
        "opacity": 0.3
    },
    "canvas": {
        "accuracy": 4
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 168,
                "wallDistance": 30,
                "parent": {
                    "dir": 1,
                    "speed": 200,
                    "size": 18
                },
                "child": {
                    "dir": -1,
                    "speed": 1.5,
                    "size": 45,
                    "conDeg": 11
                }
            },
            "1": {
                "deg": 116,
                "wallDistance": 30,
                "parent": {
                    "dir": -1,
                    "speed": 300,
                    "size": 18
                },
                "child": {
                    "dir": -1,
                    "speed": 1.5,
                    "size": 45,
                    "conDeg": 59
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(21, {
    "color": {
        "start": "#0781b6",
        "end": "#0781b6",
        "opacity": 0.3
    },
    "canvas": {
        "accuracy": 4
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 206,
                "wallDistance": 30,
                "parent": {
                    "dir": -1,
                    "speed": 146,
                    "size": 10.5
                },
                "child": {
                    "dir": 1,
                    "speed": 1.5,
                    "size": 60,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 61,
                "wallDistance": 36,
                "parent": {
                    "dir": 1,
                    "speed": 80,
                    "size": 14
                },
                "child": {
                    "dir": -1,
                    "speed": 1.5,
                    "size": 60,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 103
            }
        }
    }
});
addToPresetConfig(22, {
    "color": {
        "start": "#cb4c15",
        "end": "#cb4c15",
        "opacity": 0.2
    },
    "canvas": {
        "accuracy": 4
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 184,
                "wallDistance": 37,
                "parent": {
                    "dir": 1,
                    "speed": 270,
                    "size": 10
                },
                "child": {
                    "dir": -1,
                    "speed": 2,
                    "size": 50,
                    "conDeg": 2
                }
            },
            "1": {
                "deg": 119,
                "wallDistance": 40,
                "parent": {
                    "dir": -1,
                    "speed": 295,
                    "size": 10
                },
                "child": {
                    "dir": 1,
                    "speed": 2,
                    "size": 50,
                    "conDeg": 2
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 50
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(23, {
    "color": {
        "start": "#e60505",
        "end": "#e60505",
        "opacity": 0.2
    },
    "canvas": {
        "accuracy": 4
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 184,
                "wallDistance": 37,
                "parent": {
                    "dir": 1,
                    "speed": 260,
                    "size": 10
                },
                "child": {
                    "dir": -1,
                    "speed": 2,
                    "size": 50,
                    "conDeg": 2
                }
            },
            "1": {
                "deg": 119,
                "wallDistance": 40,
                "parent": {
                    "dir": -1,
                    "speed": 295,
                    "size": 10
                },
                "child": {
                    "dir": 1,
                    "speed": 2,
                    "size": 50,
                    "conDeg": 2
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 50
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(24, {
    "color": {
        "start": "#5e60ce",
        "end": "#5e60ce",
        "opacity": 0.2
    },
    "canvas": {
        "accuracy": 6
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 184,
                "wallDistance": 37,
                "parent": {
                    "dir": 1,
                    "speed": 250,
                    "size": 10
                },
                "child": {
                    "dir": -1,
                    "speed": 2,
                    "size": 50,
                    "conDeg": 2
                }
            },
            "1": {
                "deg": 119,
                "wallDistance": 40,
                "parent": {
                    "dir": -1,
                    "speed": 295,
                    "size": 10
                },
                "child": {
                    "dir": 1,
                    "speed": 2,
                    "size": 50,
                    "conDeg": 2
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 50
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(25, {
    "color": {
        "start": "#8187dc",
        "end": "#8187dc",
        "opacity": 0.2
    },
    "canvas": {
        "accuracy": 6
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 184,
                "wallDistance": 37,
                "parent": {
                    "dir": 1,
                    "speed": 240,
                    "size": 10
                },
                "child": {
                    "dir": -1,
                    "speed": 2,
                    "size": 50,
                    "conDeg": 2
                }
            },
            "1": {
                "deg": 119,
                "wallDistance": 40,
                "parent": {
                    "dir": -1,
                    "speed": 295,
                    "size": 10
                },
                "child": {
                    "dir": 1,
                    "speed": 2,
                    "size": 50,
                    "conDeg": 2
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 50
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(26, {
    "color": {
        "start": "#146782",
        "end": "#146782",
        "opacity": 0.2
    },
    "canvas": {
        "accuracy": 6
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 184,
                "wallDistance": 37,
                "parent": {
                    "dir": 1,
                    "speed": 150,
                    "size": 10
                },
                "child": {
                    "dir": -1,
                    "speed": 2,
                    "size": 50,
                    "conDeg": 2
                }
            },
            "1": {
                "deg": 119,
                "wallDistance": 40,
                "parent": {
                    "dir": -1,
                    "speed": 210,
                    "size": 10
                },
                "child": {
                    "dir": 1,
                    "speed": 2,
                    "size": 50,
                    "conDeg": 2
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 50
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(27, {
    "color": {
        "start": "#ee6c4d",
        "end": "#ee6c4d",
        "opacity": 0.4
    },
    "canvas": {
        "accuracy": 1
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 319,
                "wallDistance": 34,
                "parent": {
                    "dir": 1,
                    "speed": 3,
                    "size": 9.5
                },
                "child": {
                    "dir": -1,
                    "speed": 6,
                    "size": 66.5,
                    "conDeg": 75
                }
            },
            "1": {
                "deg": 119,
                "wallDistance": 37,
                "parent": {
                    "dir": -1,
                    "speed": 1,
                    "size": 10
                },
                "child": {
                    "dir": 1,
                    "speed": 137,
                    "size": 71,
                    "conDeg": 75
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 37
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(28, {
    "color": {
        "start": "#be02f2",
        "end": "#f28202",
        "opacity": 0.1
    },
    "canvas": {
        "accuracy": 1
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 0,
                "wallDistance": 30,
                "parent": {
                    "dir": 1,
                    "speed": 0.5,
                    "size": 18
                },
                "child": {
                    "dir": 1,
                    "speed": 300,
                    "size": 70,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 0,
                "wallDistance": 32,
                "parent": {
                    "dir": 1,
                    "speed": 0.5,
                    "size": 18
                },
                "child": {
                    "dir": 1,
                    "speed": 131.7,
                    "size": 70,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(29, {
    "color": {
        "start": "#be02f2",
        "end": "#f28202",
        "opacity": 0.1
    },
    "canvas": {
        "accuracy": 2
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 0,
                "wallDistance": 30,
                "parent": {
                    "dir": 1,
                    "speed": 0.5,
                    "size": 18
                },
                "child": {
                    "dir": 1,
                    "speed": 300,
                    "size": 70,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 0,
                "wallDistance": 32,
                "parent": {
                    "dir": 1,
                    "speed": 0.5,
                    "size": 18
                },
                "child": {
                    "dir": 1,
                    "speed": 131.7,
                    "size": 70,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 100
            }
        }
    }
});

addToPresetConfig(30, {
    "color": {
        "start": "#e65405",
        "end": "#f8a477",
        "opacity": 0.2
    },
    "canvas": {
        "accuracy": 2
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 162,
                "wallDistance": 30,
                "parent": {
                    "dir": 1,
                    "speed": 1,
                    "size": 18
                },
                "child": {
                    "dir": -1,
                    "speed": 300,
                    "size": 51.5,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 14,
                "wallDistance": 32,
                "parent": {
                    "dir": 1,
                    "speed": 0.5,
                    "size": 18
                },
                "child": {
                    "dir": -1,
                    "speed": 261.3,
                    "size": 63.5,
                    "conDeg": 28
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(31, {
    "color": {
        "start": "#298bbc",
        "end": "#298bbc",
        "opacity": 1
    },
    "canvas": {
        "accuracy": 0
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 0,
                "wallDistance": 34,
                "parent": {
                    "dir": 1,
                    "speed": 3,
                    "size": 14
                },
                "child": {
                    "dir": -1,
                    "speed": 0.2,
                    "size": 35,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 0,
                "wallDistance": 40,
                "parent": {
                    "dir": 1,
                    "speed": 3,
                    "size": 14
                },
                "child": {
                    "dir": -1,
                    "speed": 0.2,
                    "size": 35,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(32, {
    "color": {
        "start": "#f58114",
        "end": "#e90707",
        "opacity": 1
    },
    "canvas": {
        "accuracy": 1
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 0,
                "wallDistance": 34,
                "parent": {
                    "dir": -1,
                    "speed": 30,
                    "size": 14
                },
                "child": {
                    "dir": 1,
                    "speed": 2,
                    "size": 35,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 0,
                "wallDistance": 40,
                "parent": {
                    "dir": -1,
                    "speed": 30,
                    "size": 14
                },
                "child": {
                    "dir": 1,
                    "speed": 2,
                    "size": 35,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(33, {
    "color": {
        "start": "#94bf1d",
        "end": "#d81399",
        "opacity": 0.8
    },
    "canvas": {
        "accuracy": 1
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 0,
                "wallDistance": 34,
                "parent": {
                    "dir": 1,
                    "speed": 30,
                    "size": 14
                },
                "child": {
                    "dir": 1,
                    "speed": 1,
                    "size": 35,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 0,
                "wallDistance": 40,
                "parent": {
                    "dir": 1,
                    "speed": 30,
                    "size": 14
                },
                "child": {
                    "dir": 1,
                    "speed": 1,
                    "size": 35,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 100
            }
        }
    }
});
addToPresetConfig(34, {
    "color": {
        "start": "#1ea6c8",
        "end": "#10b796",
        "opacity": 0.8
    },
    "canvas": {
        "accuracy": 0
    },
    "machine": {
        "gear": {
            "0": {
                "deg": 0,
                "wallDistance": 24,
                "parent": {
                    "dir": 1,
                    "speed": 3,
                    "size": 15
                },
                "child": {
                    "dir": -1,
                    "speed": 0.4,
                    "size": 60,
                    "conDeg": 0
                }
            },
            "1": {
                "deg": 0,
                "wallDistance": 36,
                "parent": {
                    "dir": 1,
                    "speed": 3,
                    "size": 15
                },
                "child": {
                    "dir": -1,
                    "speed": 0.4,
                    "size": 60,
                    "conDeg": 0
                }
            }
        },
        "hand": {
            "arm": {
                "length": 5
            },
            "forearm": {
                "length": 10
            },
            "palm": {
                "length": 100
            }
        }
    }
});
// addToPresetConfig(35, );