{
  "targets": [
    {
      "target_name": "bindy",
      "sources": [
        "lib/Bindings.cc",
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")",
      ],
    },
  ],
}
