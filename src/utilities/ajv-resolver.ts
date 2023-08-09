import InputNodes from "@/components/editor/nodes";
import { toNestError, validateFieldsNatively } from "@hookform/resolvers";
import { Resolver } from "@hookform/resolvers/ajv";
import { createHeadlessEditor } from "@lexical/headless";
import Ajv, { DefinedError, Options, SchemaValidateFunction } from "ajv";
import ajvErrors from "ajv-errors";
import { $getRoot } from "lexical";
import { FieldError, appendErrors } from "react-hook-form";

export const defaultOptions: Options = {
  formats: {
    date: (dateTimeString) => {
      if (typeof dateTimeString === "object") {
        dateTimeString = (dateTimeString as Date).toISOString();
      }
      return !isNaN(Date.parse(dateTimeString));
    },
    file: (fileOrString: string | File | FileList) => {
      if (typeof fileOrString === "string") return true;
      else if (fileOrString instanceof File) return true;
      else if (fileOrString instanceof FileList) return true;
      return false;
    },
  },
  keywords: [
    {
      keyword: "relative",
      validate: function validate(schema, data, parentSchema, dataCxt) {
        (validate as any).errors = [
          {
            keyword: "relative",
            message: schema.message || dataCxt?.parentDataProperty + "invalid",
            params: { keyword: "relative" },
          },
        ];
        const relativeValue = dataCxt?.parentData[schema.relative];
        return schema.validate(data, relativeValue, dataCxt?.parentData);
      } as SchemaValidateFunction,
    },
  ],
  $data: true,
  allErrors: true,
  validateSchema: true,
  strict: false,
};

export const keywordEditor = {
  keyword: "maxChar",
  validate: function validate(
    schema: { max?: number; min?: number; message?: string },
    data,
    parentSchema,
    dataCxt
  ) {
    const editor = createHeadlessEditor({ nodes: InputNodes });
    const { max, min } = schema;
    if (!min || !max) return true;
    editor.update(() => editor.setEditorState(editor.parseEditorState(data)));
    const isValid = editor.getEditorState().read(() => {
      const length = $getRoot().getTextContent().length;
      if (length > max) return false;
      if (length < min) return false;
      return true;
    });
    {
      (validate as any).errors = [
        {
          keyword: "maxLength",
          message:
            schema.message ||
            dataCxt?.instancePath.toString().substring(1).split("/").join(".") +
              " độ dài không phù hợp",
          params: { keyword: "maxLength" },
        },
      ];
    }
    return isValid;
  } as SchemaValidateFunction,
};
const parseErrorSchema = (ajvErrors: DefinedError[], validateAllFieldCriteria: boolean) => {
  // Ajv will return empty instancePath when require error
  ajvErrors.forEach((error) => {
    if (error.keyword === "required") {
      error.instancePath += "/" + error.params.missingProperty;
    }
  });

  return ajvErrors.reduce<Record<string, FieldError>>((previous, error) => {
    // `/deepObject/data` -> `deepObject.data`
    const path = error.instancePath.substring(1).replace(/\//g, ".");
    if (["if", "oneOf", "allOf"].includes(error.keyword)) return previous;

    if (!previous[path]) {
      previous[path] = {
        message: error.message,
        type: error.keyword,
      };
    }

    if (validateAllFieldCriteria) {
      const types = previous[path].types;
      const messages = types && types[error.keyword];

      previous[path] = appendErrors(
        path,
        validateAllFieldCriteria,
        previous,
        error.keyword,
        messages
          ? ([] as string[]).concat(messages as string[], error.message || "")
          : error.message
      ) as FieldError;
    }

    return previous;
  }, {});
};

export const ajvResolver: Resolver =
  (schema, schemaOptions, resolverOptions = {}) =>
  async (values, _, options) => {
    const ajv = new Ajv(Object.assign({}, defaultOptions, schemaOptions));

    ajvErrors(ajv);

    const validate = ajv.compile(
      Object.assign({ $async: resolverOptions && resolverOptions.mode === "async" }, schema)
    );

    const valid = validate(values);

    options.shouldUseNativeValidation && validateFieldsNatively({}, options);

    return valid
      ? { values, errors: {} }
      : {
          values: {},
          errors: toNestError(
            parseErrorSchema(
              validate.errors as DefinedError[],
              !options.shouldUseNativeValidation && options.criteriaMode === "all"
            ),
            options
          ),
        };
  };
