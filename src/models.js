export class Asset {
  constructor(name, typeId, parentId, assetId) {
    this.name = name;
    this.typeId = typeId;
    this.parentId = parentId;
    this.assetId = assetId;
    this.aspects = [];
  }
}

export class Aspect {
  constructor(name, aspectTypeId, category, description) {
    this.name = name;
    this.aspectTypeId = aspectTypeId;
    this.category = category;
    this.description = description;
    this.variables = [];
  }
}

/* 
  Currently supported data types for aspect variables.
*/
export const DataTypes = {
  Boolean: "BOOLEAN",
  Int: "INT",
  Long: "LONG",
  Double: "DOUBLE",
  String: "STRING",
  TimeStamp: "TIMESTAMP",
  BigString: "BIGSTRING"

}

export class Variable {
  constructor(name, dataType, unit) {
    this.name = name;
    this.dataType = dataType;
    this.unit = unit;
  }
}

export class DataPoint {
  constructor(_time) {
    this._time = _time;
    this.properties = {};
  }
}

export const AggregationIntervalUnits = {
  Second: "second",
  Minute: "minute",
  Hour: "hour",
  Day: "day",
  Week: "week",
  Month: "month"
}

export const AggregationFieldNames = {
  CountGood: "countgood",
  CountUncertain: "countuncertain",
  CountBad: "countbad",
  Sum: "sum",
  Average: "average",
  MinTime: "mintime",
  MinValue: "minvalue",
  MaxTime: "maxtime",
  MaxValue: "maxvalue",
  FirstTime: "firsttime",
  FirstValue: "firstvalue",
  LastTime: "lasttime",
  LastValue: "lastvalue"
}

export class AggregatesResult {
  constructor(startTime, endTime) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.properties = {};
  }
}