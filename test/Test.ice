#pragma once

#include <Ice/BuiltinSequences.ice>

module Test {
    struct SomeStruct {
        bool boolVal;
    };

    class Base {
        int intVal;
        long longVal;
        optional(1) SomeStruct optionalStruct;
    };

    class TestObj extends Base {
        string stringVal;
        Ice::StringSeq stringSeqVal;
        Base nestedObject;
        SomeStruct nestedStruct;
        optional(1) Ice::IntSeq optionalIntSeqVal;
    };
};
