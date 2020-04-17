const SettingsObj = {}
const s = [
  {
    type: "collection",
    config: {
      fields: [
        {
          type: "field",
          config: {
            object: SettingsObj,
            property: 'bob',
            min: 0,
            max: 1,
            step: .1
          },
        },
      ],
    },
  },
];
