import Repository from "./repository";

async function blacklist() {
  try {
    const repo = new Repository('mongodb+srv://discord:T60e0QdHiw5rT3fT@discordautobuy.onhxf.mongodb.net/discord-sniper?retryWrites=true&w=majority');
    await repo.start();
    const addresses = [
      '0xc09bf2b1bc8725903c509e8caeef9190857215a8', '0x80f5666a6fe5c51739dc99b55463d5b098ffc10a', '0xc15e41eb55af2c0f7c34fb150a688f672d4b1be2', '0x8de7a9540e0edb617d78ca5a7c6cc18295fd8bb9', '0x6b268960693359f8c64e043d72ce7580867521b2', '0x3fdfd866fa9e1ab4b6f6762cbdce0bf787583dc3', '0xade7b949f70eafc2c0999fc6b8f18b0ea0382746', '0xb36ec83d844c0579ec2493f10b2087e96bb65460', '0x2308b672ce1ecd4fcc5f5479a5dbe56a54db17dd', '0xd2a72bb93a5d474db747cfe66745834631a31153', '0xf2498cf36ede4e28c188042a0f2fdf9d89aa4ba8', '0xb36ec83d844c0579ec2493f10b2087e96bb65460', '0x1387e926d04cab36cff8fa2a9b37a6e83f27dc7c', '0x9c04560df8dff626555317ccc2c336b9c24fda41', '0x21cef3495f084c7aeded59ff84e8602bd9f192ed', '0xdc1d67bc953bf67f007243c7ded42d67410a6de5', '0xb64de22d2aa3d4221ba424eb49ddec8a1166bf0a', '0xbf519fb74965680b45d528d29e1d77bd1728c9ce', '0x3fdfd866fa9e1ab4b6f6762cbdce0bf787583dc3', '0x6b268960693359f8c64e043d72ce7580867521b2', '0xd46934919d9138d3005c1f8db794f03e7415babd', '0xb145ba877ee7802a32c0bf2b5a49b4f662005000', '0xceb492c5e67385e2a08265352d646a0c32a5d085', '0x13e08817fb5b166517fb0b443c5bd29b0ee262d2', '0x9476f8fccefcee23481f9fa5bb5d8bdf1f145f5c', '0x13e08817fb5b166517fb0b443c5bd29b0ee262d2', '0x79d49c3231a824740649c7afa126b144d4803225', '0xc27d2fb58de00a2cf49b83dfb547d807e12e08f2', '0xde55224741a14afd8f5625bbdadb9b8c89abe69c', '0x43de4318b6eb91a7cf37975dbb574396a7b5b5c6', '0x2fd71d411706ef9031cb839995139b09444db058', '0xd025fb8b32b3ab2949d1fa3c8d20370663ae5eb6', '0x50a7f627ef094204c03e215ec52e6f47a0561b2b', '0x917c850f637e6d12ead6c4cc90dbebd7976249e9', '0xf5c678bdeefb2a2134da2654ee42160c2f9042cc', '0x1e138c0b050b91cd0b9f714bb30d9e698ee02c7a', '0xceb492c5e67385e2a08265352d646a0c32a5d085', '0xffc8305f88ca38901bf1407567a5d0e17a9c680e', '0xb068924b81e87868f36089fd01d27410f9e39a5e', '0xa80c69c00ff4663270963fa9729d2c782c26f98a', '0x256b4f0c1b10a5200a7582a7041cdcb9b7101896', '0x41aabdd22171e405a8e7b98adcff36db2ce0f68a', '0xac771d39e8a6c33b9f753d7e554f7de0c8e44da7', '0xa9966025816c490dffe18b5c58818ec14e0ce5da', '0x54bebb624ddb561b971bb07b700c9d3afd25fabc', '0x3a0769245be704267f012a841ea726a9241a8894', '0xb9f76fc1c6ca36c6a04bb1f979a3a7e3e2ffc319', '0x7a8eea153b8bd13521570685fa37906dd49485e8', '0xa6b9238691352a386a7fd6ea4832fe043be2d7c7', '0xefd8fe6b15ad0bee51e3dff0102581988c49e62e', '0xebfc41dbf87953815227d782428a453b9e412e3f', '0xaf0a40f3bf630d819312d96e9e3009fec34538ac', '0x8aeb846614f63342fdf2db8865c930b5257f21f0', '0x5899bef146be8228788c476b6384044d1a51f96e', '0xc60cc8678395114320d4957aa4d98988987e40b5', '0xe1fdcb0da6e32ee900e041e19fedbf8baec197b9', '0x2bd77c35ee11b8874be2ee60fed8b2326d8be4c9', '0x820e5f412938ab9ffdfe21804011861299f6634f', '0x3268ec60b60958ca9397576af1f896694ce5aafc', '0x32994c72b6c2c2f02422dbd3bd15103b4271563a', '0x8823af1b9e9861bdafc637ce8d7f400523a8fe35', '0x6ebd9a280cb90da52ceaba118d773130c0918c82', '0xe4b1f2fdd4a76501ccbc933992e4a9385837fef8', '0xb6f53108b920fe2eb8ed0f4d3c2c17d556d66343', '0xe59fd78557093a0beb569369ef8f47bc48a32c75', '0xbe115dd029a7b63e40fbaa4b4987e9979874bd8d', '0x471448c5e645a26323f3ec61f5075545ff522427', '0x674b57a4faf9ed8f31520d6538710b2929d1400b', '0x4a3ec09d363f513088d07f76f9f8594128b6726c', '0x19abba6322b6c907d7ef4d0481e1dd96b25b7abd', '0x5f83953ecc15434729b45d44d366e3132e3d494c', '0x28d29f0eaf4337977b52e7d568c04ad5a42eb04f', '0xcd43ae332a5b983b1b67bae3587c09be1a8759b3', '0xf21d9d6ccfb332bee9b92c3a811d809674c5caf7', '0xbbd52fac458d29050128c8d62edff4a5e7cdb0a0', '0xb65adeca6c3d2a01cc9ee161ee8ed1efbf6a97e9', '0x95826693e9d7a20179b0bdb0a83ced2f50132c04', '0x64ce276d0498038db8e6d207dac6565c18d54e12'
    ];

    addresses.forEach(async (a) => {
      const entry = await repo.insertOne({ pairAddress: a });
      console.log(entry);
    });

    console.log(`=> ${addresses.length} Documents inserted`);
  }
  catch (err) {
    console.log(err);
  }
}

blacklist();