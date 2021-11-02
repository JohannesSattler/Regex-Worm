const levels = [{
        mission: 'Match only numbers',
        regex: ['[0-9]1', '/d1', '[^a-zA-z]1', '0-92', '/d2', '[^a-zA-z]2', '0-93'],
        match: ['1234', '35345', '32108943', '809342', '7812379'],
        dontMatch: ['ads', 'fdsfsd', '/)(§%$', ')(/)/', '(/??']
    },
    {
        mission: 'Match only letters',
        regex: ['[a-zA-Z]', '/w', '[^0-9]', 'abc'],
        match: ['adsdsa', 'gfggf', 'khjkjkh', 'hjkhh', 'hjkjk'],
        dontMatch: ['/)(§%$', ')(/)/', '32108943', '809342', '7812379']
    },
]