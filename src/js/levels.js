const levels = [{
        mission: 'Match only numbers',
        regex: ['321089433', '3210894332'],
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