import { Type, Static } from "@sinclair/typebox";
import { validate } from "jsonschema";

export const Theme = Type.Object({
  colors: Type.Dict(
    Type.Union([
      Type.String(),
      Type.Tuple([Type.Number(), Type.Number(), Type.Number()]),
    ])
  ),
  images: Type.Optional(
    Type.Partial(
      Type.Object({
        theme_frame: Type.String(),
        additional_backgrounds: Type.Array(Type.String()),
      })
    )
  ),
  properties: Type.Optional(
    Type.Partial(
      Type.Object({
        additional_backgrounds_alignment: Type.String(),
        additional_backgrounds_tiling: Type.String(),
      })
    )
  ),
});
export type Theme = Static<typeof Theme>;
export const isTheme = (val: unknown): val is Theme =>
  validate(val, Theme).valid;

export const Variables = Type.Dict(Type.String());
export type Variables = Static<typeof Variables>;
export const isVariables = (val: unknown): val is Variables =>
  validate(val, Variables).valid;

export const Input = Type.Object({
  theme: Theme,
  variables: Variables,
});
export type Input = Static<typeof Input>;
export const isInput = (val: unknown): val is Input =>
  validate(val, Input).valid;
