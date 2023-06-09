
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.(machine).upload.compressing:invocation[0]": { type: "done.invoke.(machine).upload.compressing:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.(machine).upload.validating:invocation[0]": { type: "done.invoke.(machine).upload.validating:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "compress_data": "done.invoke.(machine).upload.compressing:invocation[0]";
"upload_file": "done.invoke.(machine).upload.uploading:invocation[0]";
"validate_capcha": "done.invoke.(machine).upload.validating:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "reset": "BACK_TO_SELECT_FILES";
"set_progress": "COMPRESSION_PROGRESS" | "UPLOAD_PROGRESS";
"wipe_target": "BACK_TO_SELECT_MACHINE";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "compress_data": "done.invoke.(machine).upload.validating:invocation[0]";
"upload_file": "COMPRESSION_DONE" | "done.invoke.(machine).upload.compressing:invocation[0]";
"validate_capcha": "UPLOAD_START";
        };
        matchesStates: "done" | "select_files" | "select_machine" | "upload" | "upload.compressing" | "upload.upload_error" | "upload.uploading" | "upload.validating" | "upload.waiting" | { "upload"?: "compressing" | "upload_error" | "uploading" | "validating" | "waiting"; };
        tags: never;
      }
  