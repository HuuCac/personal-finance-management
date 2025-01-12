"use client"

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Transaction {
  id: number;
  createdAt: string;
  note: string;
  amount: number;
  type: string;
}

type SortableFields = keyof Pick<Transaction, "createdAt" | "note" | "amount" | "type">;

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortColumn, setSortColumn] = useState<SortableFields>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:3002/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          throw new Error("Failed to fetch transactions");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const sortedAndFilteredTransactions = transactions
    .filter(
      (transaction) =>
        (filterType === "all" || transaction.type === filterType) &&
        (transaction.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.amount.toString().includes(searchTerm))
    )
    .sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (column: SortableFields) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const openModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Search className="text-gray-400" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Income">Income</SelectItem>
            <SelectItem value="Expense">Expense</SelectItem>
            <SelectItem value="Investment">Investment</SelectItem>
            <SelectItem value="Gift">Gift</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button variant="ghost" onClick={() => handleSort("createdAt")}>
                Create at
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("note")}>
                Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("amount")}>
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("type")}>
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredTransactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              onClick={() => openModal(transaction)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">
                {formatDate(transaction.createdAt)}
              </TableCell>
              <TableCell>{transaction.note || "No description"}</TableCell>
              <TableCell
                className={
                  transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                ${Math.abs(transaction.amount).toFixed(2)}
              </TableCell>
              <TableCell>{transaction.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Transaction Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              View the details of the selected transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-2">
              <p>
                <strong>Date:</strong> {formatDate(selectedTransaction.createdAt)}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedTransaction.note || "No description"}
              </p>
              <p>
                <strong>Amount:</strong> $
                {Math.abs(selectedTransaction.amount).toFixed(2)}
              </p>
              <p>
                <strong>Type:</strong> {selectedTransaction.type}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={closeModal}>
              <X className="mr-2 h-4 w-4" /> Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
