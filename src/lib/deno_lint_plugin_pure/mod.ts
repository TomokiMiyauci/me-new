export default {
  name: "pure",
  rules: {
    "pure-init-on-top-level": {
      create(context) {
        function hasPureComment(node: Deno.lint.Expression): boolean {
          const comments = context.sourceCode.getCommentsBefore(node);

          return comments.some(({ value }) => /@__PURE__/.test(value));
        }

        function decl(
          node:
            | Deno.lint.ExportNamedDeclaration
            | Deno.lint.ExportDefaultDeclaration,
        ): void {
          const decl = node.declaration;

          if (node.parent.type === "Program") {
            if (decl && decl.type === "VariableDeclaration") {
              for (const d of decl.declarations) {
                if (
                  d.init && isSideEffect(d.init) && !hasPureComment(d.init)
                ) {
                  context.report({
                    node: d,
                    message: "Missing pure anotation",
                  });
                }
              }
            }
          }
        }

        return {
          VariableDeclaration(node) {
            if (node.parent.type === "Program") {
              for (const decl of node.declarations) {
                if (
                  decl.init && isSideEffect(decl.init) &&
                  !hasPureComment(decl.init)
                ) {
                  context.report({
                    node: decl,
                    message: "Missing pure anotation",
                  });
                }
              }
            }
          },
          ExportNamedDeclaration: decl,
          ExportDefaultDeclaration: decl,
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;

function isSideEffect(expr: Deno.lint.Expression): boolean {
  switch (expr.type) {
    case "CallExpression":
    case "NewExpression":
    case "UpdateExpression":
      return true;
    case "UnaryExpression":
      return expr.operator === "delete";
    case "SequenceExpression":
      return expr.expressions.some(isSideEffect);
    default:
      return false;
  }
}
