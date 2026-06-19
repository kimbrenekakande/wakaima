"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Add01Icon,
  Mail01Icon,
  FilterIcon,
  MoreHorizontalIcon,
  Search01Icon,
  Tick01Icon,
  Cancel01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";

export default function EmailsPage() {
  return (
    <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-background w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">Emails</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your email campaigns and templates
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="gap-2">
                  <span>Bulk Actions</span>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="size-4 text-muted-foreground"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <HugeiconsIcon icon={Tick01Icon} className="size-4 mr-2" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Mail01Icon} className="size-4 mr-2" />
                Archive Selected
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Delete01Icon} className="size-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90 cursor-pointer">
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
            <span>New Campaign</span>
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="gap-2">
                <HugeiconsIcon icon={FilterIcon} className="size-4" />
                <span>All Statuses</span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className="size-4 text-muted-foreground"
                />
              </Button>
            }
          />
          <DropdownMenuContent align="start">
            <DropdownMenuItem>All Statuses</DropdownMenuItem>
            <DropdownMenuItem>Sent</DropdownMenuItem>
            <DropdownMenuItem>Draft</DropdownMenuItem>
            <DropdownMenuItem>Scheduled</DropdownMenuItem>
            <DropdownMenuItem>Failed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="gap-2">
                  <span>Sort by</span>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="size-4 text-muted-foreground"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Newest First</DropdownMenuItem>
              <DropdownMenuItem>Oldest First</DropdownMenuItem>
              <DropdownMenuItem>Budget: High to Low</DropdownMenuItem>
              <DropdownMenuItem>Budget: Low to High</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon" className="size-9">
                  <HugeiconsIcon
                    icon={MoreHorizontalIcon}
                    className="size-4"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <HugeiconsIcon icon={Search01Icon} className="size-4 mr-2" />
                Search Emails
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Cancel01Icon} className="size-4 mr-2" />
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableCaption>A list of current projects.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-right">Budget</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="size-5 text-muted-foreground shrink-0" />
                <span className="font-medium">Website Redesign</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-emerald-500"
                />
                Paid
              </Badge>
            </TableCell>
            <TableCell>Frontend Team</TableCell>
            <TableCell className="text-right">$12,500</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="size-5 text-muted-foreground shrink-0" />
                <span className="font-medium">Mobile App</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-muted-foreground/64"
                />
                Unpaid
              </Badge>
            </TableCell>
            <TableCell>Mobile Team</TableCell>
            <TableCell className="text-right">$8,750</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="size-5 text-muted-foreground shrink-0" />
                <span className="font-medium">API Integration</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-amber-500"
                />
                Pending
              </Badge>
            </TableCell>
            <TableCell>Backend Team</TableCell>
            <TableCell className="text-right">$5,200</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="size-5 text-muted-foreground shrink-0" />
                <span className="font-medium">Database Migration</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-emerald-500"
                />
                Paid
              </Badge>
            </TableCell>
            <TableCell>DevOps Team</TableCell>
            <TableCell className="text-right">$3,800</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="size-5 text-muted-foreground shrink-0" />
                <span className="font-medium">User Dashboard</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-emerald-500"
                />
                Paid
              </Badge>
            </TableCell>
            <TableCell>UX Team</TableCell>
            <TableCell className="text-right">$7,200</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="size-5 text-muted-foreground shrink-0" />
                <span className="font-medium">Security Audit</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-red-500"
                />
                Failed
              </Badge>
            </TableCell>
            <TableCell>Security Team</TableCell>
            <TableCell className="text-right">$2,100</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Budget</TableCell>
            <TableCell className="text-right">$39,550</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </main>
  );
}
