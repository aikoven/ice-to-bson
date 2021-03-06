// **********************************************************************
//
// Copyright (c) 2003-2017 ZeroC, Inc. All rights reserved.
//
// This copy of Ice is licensed to you under the terms described in the
// ICE_LICENSE file included in this distribution.
//
// **********************************************************************
//
// Ice version 3.7.0
//
// <auto-generated>
//
// Generated from file `Test.ice'
//
// Warning: do not edit this file.
//
// </auto-generated>
//

(function(module, require, exports)
{
    const Ice = require("ice").Ice;
    const _ModuleRegistry = Ice._ModuleRegistry;
    const Slice = Ice.Slice;

    let Test = _ModuleRegistry.module("Test");

    Test.SomeStruct = class
    {
        constructor(boolVal = false)
        {
            this.boolVal = boolVal;
        }

        _write(ostr)
        {
            ostr.writeBool(this.boolVal);
        }

        _read(istr)
        {
            this.boolVal = istr.readBool();
        }

        static get minWireSize()
        {
            return  1;
        }
    };

    Slice.defineStruct(Test.SomeStruct, true, false);

    const iceC_Test_Base_ids = [
        "::Ice::Object",
        "::Test::Base"
    ];

    Test.Base = class extends Ice.Value
    {
        constructor(intVal = 0, longVal = new Ice.Long(0, 0), optionalStruct = undefined)
        {
            super();
            this.intVal = intVal;
            this.longVal = longVal;
            this.optionalStruct = optionalStruct;
        }

        _iceWriteMemberImpl(ostr)
        {
            ostr.writeInt(this.intVal);
            ostr.writeLong(this.longVal);
            Test.SomeStruct.writeOptional(ostr, 1, this.optionalStruct);
        }

        _iceReadMemberImpl(istr)
        {
            this.intVal = istr.readInt();
            this.longVal = istr.readLong();
            this.optionalStruct = Test.SomeStruct.readOptional(istr, 1);
        }
    };

    Slice.defineValue(Test.Base, iceC_Test_Base_ids[1], false);

    Test.BaseDisp = class extends Ice.Object
    {
    };

    Slice.defineOperations(Test.BaseDisp, undefined, iceC_Test_Base_ids, 1);

    const iceC_Test_TestObj_ids = [
        "::Ice::Object",
        "::Test::Base",
        "::Test::TestObj"
    ];

    Test.TestObj = class extends Test.Base
    {
        constructor(intVal, longVal, optionalStruct, stringVal = "", stringSeqVal = null, nestedObject = null, nestedStruct = new Test.SomeStruct(), optionalIntSeqVal = undefined)
        {
            super(intVal, longVal, optionalStruct);
            this.stringVal = stringVal;
            this.stringSeqVal = stringSeqVal;
            this.nestedObject = nestedObject;
            this.nestedStruct = nestedStruct;
            this.optionalIntSeqVal = optionalIntSeqVal;
        }

        _iceWriteMemberImpl(ostr)
        {
            ostr.writeString(this.stringVal);
            Ice.StringSeqHelper.write(ostr, this.stringSeqVal);
            ostr.writeValue(this.nestedObject);
            Test.SomeStruct.write(ostr, this.nestedStruct);
            Ice.IntSeqHelper.writeOptional(ostr, 1, this.optionalIntSeqVal);
        }

        _iceReadMemberImpl(istr)
        {
            this.stringVal = istr.readString();
            this.stringSeqVal = Ice.StringSeqHelper.read(istr);
            istr.readValue(obj => this.nestedObject = obj, Test.Base);
            this.nestedStruct = Test.SomeStruct.read(istr, this.nestedStruct);
            this.optionalIntSeqVal = Ice.IntSeqHelper.readOptional(istr, 1);
        }
    };

    Slice.defineValue(Test.TestObj, iceC_Test_TestObj_ids[2], false);

    Test.TestObjDisp = class extends Test.BaseDisp
    {
    };

    Slice.defineOperations(Test.TestObjDisp, undefined, iceC_Test_TestObj_ids, 2);
    exports.Test = Test;
}
(typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? module : undefined,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? require : this.Ice._require,
 typeof(global) !== "undefined" && typeof(global.process) !== "undefined" ? exports : this));
