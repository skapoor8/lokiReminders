/**
 * file:        upversion.cjs
 * author:      Siddharth Kapoor
 * purpose:     
 *  Updates patch version of a package if the published version is greater
 *  
 * dependencies:
 *  - semver
 */

 const { exec } = require('child_process');
 const { readFile, stat } = require('fs/promises');
 const { promisify } = require('util');

 const gte = require('semver/functions/gte');
 const neq = require('semver/functions/neq');
 
 // script -----------------------------------------------------------------------------------------
 
 main();
 
 // helpers ----------------------------------------------------------------------------------------
 
 async function main() {
     try {
         if (await isNpmPackage()) {
             const publishedVerString = await getPublishedVersion();
             const thisVersionString = await getPackageVersion();
             // console.log('current:', thisVersionString, 'published:', publishedVerString);
         
             if (gte(publishedVerString, thisVersionString)) {
                 await updatePatchVersion(publishedVerString, thisVersionString);
             }
         } else {
             console.error('Upversion: script must be run in a node module');
         }
     } catch(e) {
         console.error('Upversion failed.');
         console.error(e);
     }
 }
 
 async function isNpmPackage() {
     try {
         const fstat = await stat('package.json');
         return !!fstat;
     } catch(e) {
         return false;
     }
 }
 
 async function getPublishedVersion() {
     try {
         const pkgName = await getPackageName();
         const execAsync = promisify(exec);
         const npmVersionOutput = await execAsync(`npm show ${pkgName} version`);
         const pubVer = npmVersionOutput.stdout;
         return pubVer;
     } catch (e) {
         const error = new Error(
             'getPublishedVersion: error getting package version\n' +
             e
         )
         throw(error);
     }
 }
 
 async function getPackageVersion() {
     try {
         const pkgFile = await readFile('package.json');
         const parsedFile = JSON.parse(pkgFile);
         const ver = parsedFile.version;
         return ver;
     } catch (e) {
         const error = new Error(
             'getPackageVersion: error getting package version\n' +
             e
         );
         throw(error);
     }
 }
 
 
 async function getPackageName() {
     try {
         const pkgFile = await readFile('package.json');
         const parsedFile = JSON.parse(pkgFile);
         const name = parsedFile.name;
         return name;
     } catch (e) {
         const error = new Error(
             'getPackageName: error getting package version\n' +
             e
         );
         throw(error);
     }
 }
 
 
 async function updatePatchVersion(latest, current) {
     console.log('updating patch version');
     try {
         const execAsync = promisify(exec);
         if (neq(latest, current)) {
             await execAsync(`npm version ${latest}`);
         }
         await execAsync('npm version patch --force');
         const newVersion = await getPackageVersion();
         // console.log('new package version is:', newVersion);
     } catch(e) {
         const error = new Error(
             'upatePatchVersion error\n' +
             e
         );
         throw(error);
     }
 }