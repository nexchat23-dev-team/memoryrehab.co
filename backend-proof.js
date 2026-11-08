(async () => {
  const base = process.env.API_BASE || 'http://localhost:4000';
  const adminHeaders = {
    'Content-Type': 'application/json',
    'x-admin-key': process.env.ADMIN_PASSKEY || 'lab2026'
  };

  const settingsBefore = await (await fetch(base + '/api/settings')).json();
  console.log('SETTINGS_BEFORE', JSON.stringify(settingsBefore));

  const health = await fetch(base + '/api/health');
  console.log('HEALTH_STATUS', health.status);
  console.log('HEALTH_BODY', await health.text());

  const create = await fetch(base + '/api/products', {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'QA Test Product',
      step: 'Step 2: Target & Treat',
      badge: 'QA',
      price: 99,
      originalPrice: 129,
      image: 'photo_2026-09-09_17-33-58.jpg',
      rating: 4.9,
      reviews: 1,
      size: '30ml / 1.0 fl. oz',
      skinType: '🌿 For: QA Testing',
      summary: 'Backend validation product created by automated test',
      ingredients: ['Alpha', 'Beta', 'Gamma'],
      inStock: true
    })
  });

  const created = await create.json();
  console.log('CREATE_STATUS', create.status);
  console.log('CREATED_PRODUCT', JSON.stringify(created));

  const update = await fetch(base + '/api/products/' + created.id, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'QA Test Product Updated',
      price: 110,
      originalPrice: 140,
      badge: 'UPDATED'
    })
  });

  console.log('UPDATE_STATUS', update.status);
  console.log('UPDATED_PRODUCT', await update.text());

  const getOne = await fetch(base + '/api/products/' + created.id);
  console.log('GET_ONE_STATUS', getOne.status);
  console.log('GET_ONE_BODY', JSON.stringify(await getOne.json()));

  const settingsUpdate = await fetch(base + '/api/settings', {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({
      ...settingsBefore,
      promoCode: 'OWNERTEST',
      promoDiscount: 20,
      freeShippingThreshold: 75,
      announcement: 'Updated by backend test'
    })
  });

  console.log('SETTINGS_UPDATE_STATUS', settingsUpdate.status);
  console.log('SETTINGS_UPDATE_BODY', await settingsUpdate.text());

  const settingsAfter = await (await fetch(base + '/api/settings')).json();
  console.log('SETTINGS_AFTER', JSON.stringify(settingsAfter));

  const del = await fetch(base + '/api/products/' + created.id, {
    method: 'DELETE',
    headers: adminHeaders
  });
  console.log('DELETE_STATUS', del.status);
  console.log('DELETE_BODY', await del.text());

  const restore = await fetch(base + '/api/settings', {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify(settingsBefore)
  });

  console.log('RESTORE_STATUS', restore.status);
  console.log('RESTORE_BODY', await restore.text());
})();
