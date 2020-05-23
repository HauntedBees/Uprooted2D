declare var PIXI:{
    Container: PIXIContainer,
    Point: any,
    settings: any,
    SCALE_MODES: any,
    Application: any,
    Loader: any,
    utils: any,
    AnimatedSprite: PIXIObj,
    Texture: any,
    Rectangle: any,
    Sprite: PIXIObj,
    Graphics: any
    TextStyle: any
    TextMetrics: any,
    Text: any
};
declare var PIXIObj:{
    ():void,
    Point:any,
    anchor:any,
    pivot:any,
    position:any,
    scale:any,
    children:PIXIObj[],
    interactive:boolean,
    texture:any,
    text: string,
    x: number,
    y: number,
    width: number,
    visible:boolean;
    on(a:string, b:any):void,
    removeChild(pixiObj)
    addChild(pixiObj)
};
declare var MultiStyleText:PIXIObj;
declare var GetText:any;
declare var TryGetText:any;
declare var HandlePlurals:any;
declare var animalInfo:any;
declare var AddAchievementIfMissing:any;
declare var levelStats:any;
declare var GetEquipment:any;
declare var GetCrop:any;
declare var GetFarmInfo:any;
declare var debug:any;
declare var scripts:any;
declare var SpecialFunctions:any;
declare var stores:any;