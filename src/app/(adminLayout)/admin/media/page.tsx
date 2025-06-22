/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, Search, LucideIcon } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Globe, Rss, Mail, LinkIcon } from "lucide-react"
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/reusable/Button/Button";

const AdminMediaPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemUrl, setItemUrl] = useState("");
  const [itemIconName, setItemIconName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Effect to handle hydration and prevent server/client mismatch for zustand
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const openModalForEdit = (id: string) => {
    setIsModalOpen(true)
    console.log(id);
    
  };

  const openModalForNew = () => {
    setEditingItem(null);
    setItemName("");
    setItemUrl("");
    setItemIconName("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = () => {
    console.log("object");
    closeModal();
  };

  const handleDelete = (id: string) => {
    console.log(id);
  };

  const filteredItems:any[] = [1, 2, 3, 4];

  const availableIconsList: any[] = [
  { value: "Facebook", label: "Facebook", IconComponent: Facebook },
  { value: "Twitter", label: "Twitter", IconComponent: Twitter },
  { value: "Instagram", label: "Instagram", IconComponent: Instagram },
  { value: "Linkedin", label: "LinkedIn", IconComponent: Linkedin },
  { value: "Youtube", label: "YouTube", IconComponent: Youtube },
  { value: "Github", label: "GitHub", IconComponent: Github },
  { value: "Globe", label: "Website/Globe", IconComponent: Globe },
  { value: "Rss", label: "RSS Feed", IconComponent: Rss },
  { value: "Mail", label: "Email", IconComponent: Mail },
  { value: "Link", label: "Generic Link", IconComponent: LinkIcon },
  // Add more icons as needed
]
  const getIconComponentByName = (iconName?: string): LucideIcon | undefined => {
  if (!iconName) return undefined
  return availableIconsList.find((icon) => icon.value === iconName)?.IconComponent
}

  if (!hydrated) {
    // Render nothing or a loading indicator until the store is hydrated
    return <AdminMediaLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <Card className="bg-gray-800/60 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Manage Media Links
          </CardTitle>
          <Button
            onClick={openModalForNew}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Link
          </Button>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-400 mb-4">
            Add, edit, or delete social media links and other important URLs.
          </CardDescription>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {filteredItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/30">
                    <TableHead className="w-[80px]">Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="text-right w-[150px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const IconComponent = getIconComponentByName(item.iconName);
                    return (
                      <TableRow
                        key={item.id}
                        className="border-gray-700 hover:bg-gray-700/30"
                      >
                        <TableCell>
                          {IconComponent ? (
                            <IconComponent className="h-6 w-6 text-gray-300" />
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline truncate max-w-xs inline-block"
                          >
                            {item.url}
                          </a>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openModalForEdit(item.id)}
                            className="text-yellow-400 hover:text-yellow-300 mr-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                  This action cannot be undone. This will
                                  permanently delete the media link.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="hover:bg-gray-700">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No media links found. Click "Add New Link" to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Media Link" : "Add New Media Link"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right col-span-1">
                Name
              </Label>
              <Input
                id="name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="col-span-3 bg-gray-700 border-gray-600 placeholder-gray-400"
                placeholder="e.g., Follow us on Twitter"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right col-span-1">
                URL
              </Label>
              <Input
                id="url"
                type="url"
                value={itemUrl}
                onChange={(e) => setItemUrl(e.target.value)}
                className="col-span-3 bg-gray-700 border-gray-600 placeholder-gray-400"
                placeholder="https://twitter.com/yourprofile"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right col-span-1">
                Icon
              </Label>
              <Select value={itemIconName} onValueChange={setItemIconName}>
                <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 placeholder-gray-400">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {availableIconsList.map((iconOpt) => (
                    <SelectItem
                      key={iconOpt.value}
                      value={iconOpt.value}
                      className="hover:bg-gray-600"
                    >
                      <div className="flex items-center">
                        <iconOpt.IconComponent className="mr-2 h-5 w-5" />
                        {iconOpt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="hover:bg-gray-700"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingItem ? "Save Changes" : "Add Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Basic Skeleton for loading state
const AdminMediaLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
    <Card className="bg-gray-800/60 border-gray-700 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-8 w-1/3 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-700 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="h-6 w-1/2 bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="mb-4">
          <div className="h-10 w-full bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="overflow-x-auto">
          <div className="h-12 w-full bg-gray-700 rounded animate-pulse mb-2"></div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 w-full bg-gray-700 rounded animate-pulse mb-2"
            ></div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminMediaPage;
