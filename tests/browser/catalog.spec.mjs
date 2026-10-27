import {test,expect} from '@playwright/test';
import {isolate} from './isolation.mjs';
for(const path of ['/planes','/precios','/checkout'])test('catalog fail closed '+path,async({page,context})=>{
 const audit=await isolate(context);await page.goto(path);
 await expect(page.getByRole('alert').filter({hasText:'Catálogo no disponible'})).toBeVisible();
 await expect(page.getByText(/\bARS\s+\d/)).toHaveCount(0);
 expect(audit.forbidden).toEqual([]);expect(audit.unexpected).toEqual([]);
});
