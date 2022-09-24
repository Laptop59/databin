# Package
A package is a tag DataBin has that can contain other tags inside. It has a id of `0x0d`. It can store tags inside (like the name implies). Packages can also be stored inside packages.

<Image src="PackageIcon"/><br/>

<sub><sup><span style="color:black;">A package</span></sup></sub>

It occupies a variable amount of bytes in value. It can store up to `2147483647` tags without malfunctions.

## How it's stored
```
Bytes:
<0x0d> <name...> <0x00> <count... (0x00000000-0xFFFFFFFF)> <data>
```