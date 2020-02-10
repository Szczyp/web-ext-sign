with import <nixpkgs> {};
mkShell {
  buildInputs = with nodePackages; [
    nodejs-12_x
    python3
    pnpm
    typescript
    typescript-language-server
  ];
}
