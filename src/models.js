/**
 * Lightweight representation of an asset, that stores only partial information
 * return from the Asset Management API.
 *
 * @export
 * @class Asset
 */
export class Asset {
  constructor(name, description, typeId, parentId, assetId) {
    this.name = name;
    this.description = description;
    this.typeId = typeId;
    this.parentId = parentId;
    this.assetId = assetId;
    this.aspects = [];
  }

  setAspects(aspects) {
    if (aspects == null) {
      this.aspects = [];
    } else {
      this.aspects = aspects;
    }
  }

  getAspects() {
    return this.aspects;
  }
}

export class Aspect {
  constructor(name, description, aspectTypeId, rawVariables=[]) {
    this.name = name;
    this.aspectTypeId = aspectTypeId;
    this.description = description;
    this.variables = rawVariables.map(v => {
      return new Variable(v.name, v.dataType, v.unit);
    });

  }

  getVariables() {
    return this.variables;
  }

  /**
   * Get all variables with numeric datatype. See {DataTypes} for more information.
   *
   * @returns {Array} list of variables with numeric datatype
   * @memberof Aspect
   */
  getNumericVariables() {
    return this.variables.filter(v => {
      return v.isNumeric();
    });
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

  isNumeric() {
    return this.dataType === DataTypes.Int || this.dataType === DataTypes.Long || this.dataType === DataTypes.Double;
  }

  getUnit() {
    return this.unit;
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