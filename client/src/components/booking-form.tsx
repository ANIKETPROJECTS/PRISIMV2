import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertTriangle, AlertCircle, Radio } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Booking, Customer, Project, Room, Editor, CustomerContact } from "@shared/schema";

const bookingFormSchema = z.object({
  roomType: z.enum(["system", "client"]).default("system"),
  roomId: z.string().optional(),
  clientRoomName: z.string().optional(),
  clientRoomType: z.string().optional(),
  clientRoomCapacity: z.string().optional(),
  customerId: z.string().min(1, "Customer is required"),
  projectId: z.string().min(1, "Project is required"),
  contactId: z.string().optional(),
  editorType: z.enum(["system", "client"]).default("system"),
  editorId: z.string().optional(),
  clientEditorName: z.string().optional(),
  clientEditorType: z.string().optional(),
  clientEditorPhone: z.string().optional(),
  clientEditorEmail: z.string().optional(),
  bookingDate: z.string().min(1, "Date is required"),
  fromTime: z.string().min(1, "Start time is required"),
  toTime: z.string().min(1, "End time is required"),
  actualFromTime: z.string().optional(),
  actualToTime: z.string().optional(),
  breakHours: z.string().default("0"),
  status: z.enum(["planning", "tentative", "confirmed"]),
  notes: z.string().optional(),
  repeatDays: z.number().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking | null;
  defaultDate?: Date;
}

interface ConflictResult {
  hasConflict: boolean;
  conflicts: Array<{ type: string; booking: any; message: string }>;
  editorOnLeave: boolean;
  leaveInfo?: any;
}

export function BookingForm({ open, onOpenChange, booking, defaultDate }: BookingFormProps) {
  const { toast } = useToast();
  const [conflictResult, setConflictResult] = useState<ConflictResult | null>(null);
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
  const [roomTypeSelection, setRoomTypeSelection] = useState<"system" | "client">("system");
  const [editorTypeSelection, setEditorTypeSelection] = useState<"system" | "client">("system");

  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
    enabled: open,
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
    enabled: open,
  });

  const { data: editors = [] } = useQuery<Editor[]>({
    queryKey: ["/api/editors"],
    enabled: open,
  });

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      roomType: booking?.roomId ? "system" : "client",
      roomId: booking?.roomId?.toString() || "",
      clientRoomName: "",
      clientRoomType: "",
      clientRoomCapacity: "",
      customerId: booking?.customerId?.toString() || "",
      projectId: booking?.projectId?.toString() || "",
      contactId: booking?.contactId?.toString() || "",
      editorType: booking?.editorId ? "system" : "client",
      editorId: booking?.editorId?.toString() || "",
      clientEditorName: "",
      clientEditorType: "",
      clientEditorPhone: "",
      clientEditorEmail: "",
      bookingDate: booking?.bookingDate || (defaultDate ? format(defaultDate, "yyyy-MM-dd") : ""),
      fromTime: booking?.fromTime || "09:00",
      toTime: booking?.toTime || "18:00",
      actualFromTime: booking?.actualFromTime || "",
      actualToTime: booking?.actualToTime || "",
      breakHours: booking?.breakHours?.toString() || "0",
      status: (booking?.status as any) || "planning",
      notes: booking?.notes || "",
    },
  });

  const selectedCustomerId = form.watch("customerId");

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: [`/api/projects?customerId=${selectedCustomerId}`],
    enabled: !!selectedCustomerId,
  });

  const { data: contacts = [] } = useQuery<CustomerContact[]>({
    queryKey: [`/api/customers/${selectedCustomerId}/contacts`],
    enabled: !!selectedCustomerId,
  });

  // Watch for conflict-related fields
  const watchedRoomId = form.watch("roomId");
  const watchedEditorId = form.watch("editorId");
  const watchedBookingDate = form.watch("bookingDate");
  const watchedFromTime = form.watch("fromTime");
  const watchedToTime = form.watch("toTime");

  // Check for conflicts when relevant fields change
  const checkConflicts = useCallback(async () => {
    if (!watchedRoomId || !watchedBookingDate || !watchedFromTime || !watchedToTime) {
      setConflictResult(null);
      return;
    }

    setIsCheckingConflicts(true);
    try {
      const response = await apiRequest("POST", "/api/bookings/check-conflicts", {
        roomId: watchedRoomId,
        editorId: watchedEditorId || undefined,
        bookingDate: watchedBookingDate,
        fromTime: watchedFromTime,
        toTime: watchedToTime,
        excludeBookingId: booking?.id,
      });
      setConflictResult(response as ConflictResult);
    } catch (error) {
      console.error("Error checking conflicts:", error);
    } finally {
      setIsCheckingConflicts(false);
    }
  }, [watchedRoomId, watchedEditorId, watchedBookingDate, watchedFromTime, watchedToTime, booking?.id]);

  useEffect(() => {
    if (open && watchedRoomId && watchedBookingDate && watchedFromTime && watchedToTime) {
      const timer = setTimeout(() => {
        checkConflicts();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, checkConflicts, watchedRoomId, watchedBookingDate, watchedFromTime, watchedToTime]);

  // Reset conflict result when dialog closes
  useEffect(() => {
    if (!open) {
      setConflictResult(null);
    }
  }, [open]);

  const createMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      return apiRequest("POST", "/api/bookings", {
        roomId: data.roomType === "system" && data.roomId ? parseInt(data.roomId) : null,
        clientRoomName: data.roomType === "client" ? data.clientRoomName : null,
        clientRoomType: data.roomType === "client" ? data.clientRoomType : null,
        clientRoomCapacity: data.roomType === "client" && data.clientRoomCapacity ? parseInt(data.clientRoomCapacity) : null,
        customerId: parseInt(data.customerId),
        projectId: parseInt(data.projectId),
        contactId: data.contactId ? parseInt(data.contactId) : null,
        editorId: data.editorType === "system" && data.editorId ? parseInt(data.editorId) : null,
        clientEditorName: data.editorType === "client" ? data.clientEditorName : null,
        clientEditorType: data.editorType === "client" ? data.clientEditorType : null,
        clientEditorPhone: data.editorType === "client" ? data.clientEditorPhone : null,
        clientEditorEmail: data.editorType === "client" ? data.clientEditorEmail : null,
        bookingDate: data.bookingDate,
        fromTime: data.fromTime,
        toTime: data.toTime,
        actualFromTime: data.actualFromTime || null,
        actualToTime: data.actualToTime || null,
        breakHours: parseInt(data.breakHours) || 0,
        status: data.status,
        notes: data.notes,
        repeatDays: data.repeatDays,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => 
        typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/api/bookings')
      });
      toast({ title: "Booking created successfully" });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error creating booking",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      return apiRequest("PATCH", `/api/bookings/${booking?.id}`, {
        roomId: data.roomType === "system" && data.roomId ? parseInt(data.roomId) : null,
        clientRoomName: data.roomType === "client" ? data.clientRoomName : null,
        clientRoomType: data.roomType === "client" ? data.clientRoomType : null,
        clientRoomCapacity: data.roomType === "client" && data.clientRoomCapacity ? parseInt(data.clientRoomCapacity) : null,
        customerId: parseInt(data.customerId),
        projectId: parseInt(data.projectId),
        contactId: data.contactId ? parseInt(data.contactId) : null,
        editorId: data.editorType === "system" && data.editorId ? parseInt(data.editorId) : null,
        clientEditorName: data.editorType === "client" ? data.clientEditorName : null,
        clientEditorType: data.editorType === "client" ? data.clientEditorType : null,
        clientEditorPhone: data.editorType === "client" ? data.clientEditorPhone : null,
        clientEditorEmail: data.editorType === "client" ? data.clientEditorEmail : null,
        bookingDate: data.bookingDate,
        fromTime: data.fromTime,
        toTime: data.toTime,
        actualFromTime: data.actualFromTime || null,
        actualToTime: data.actualToTime || null,
        breakHours: parseInt(data.breakHours) || 0,
        status: data.status,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => 
        typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/api/bookings')
      });
      toast({ title: "Booking updated successfully" });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating booking",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    if (booking) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{booking ? "Edit Booking" : "New Booking"}</DialogTitle>
          <DialogDescription>
            {booking ? "Update the booking details below." : "Fill in the details to create a new booking."}
          </DialogDescription>
        </DialogHeader>

        {conflictResult?.editorOnLeave && (
          <Alert variant="destructive" data-testid="alert-editor-leave">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Editor on Leave</AlertTitle>
            <AlertDescription>
              The selected editor is on leave during this date. Please choose a different editor or date.
            </AlertDescription>
          </Alert>
        )}

        {conflictResult?.hasConflict && (
          <Alert variant="destructive" data-testid="alert-conflicts">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Booking Conflicts ({conflictResult.conflicts.length})</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {conflictResult.conflicts.map((conflict, index) => (
                  <li key={index} className="text-sm">
                    {conflict.message} ({conflict.booking?.fromTime} - {conflict.booking?.toTime})
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type *</FormLabel>
                    <div className="flex gap-4 mt-2">
                      <Button
                        type="button"
                        variant={roomTypeSelection === "system" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setRoomTypeSelection("system");
                          field.onChange("system");
                        }}
                        data-testid="button-room-system"
                      >
                        System Room
                      </Button>
                      <Button
                        type="button"
                        variant={roomTypeSelection === "client" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setRoomTypeSelection("client");
                          field.onChange("client");
                        }}
                        data-testid="button-room-client"
                      >
                        Client Room
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {roomTypeSelection === "system" ? (
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Room *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-room">
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.filter(r => r.isActive).map((room) => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            {room.name} ({room.roomType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="clientRoomName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., My Studio" data-testid="input-client-room-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientRoomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger data-testid="select-client-room-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="editing">Editing</SelectItem>
                          <SelectItem value="vfx">VFX</SelectItem>
                          <SelectItem value="sound">Sound</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="dubbing">Dubbing</SelectItem>
                          <SelectItem value="mixing">Mixing</SelectItem>
                          <SelectItem value="client_office">Client Office</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientRoomCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5" min="1" data-testid="input-client-room-capacity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-customer">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.filter(c => c.isActive).map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!selectedCustomerId}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-project">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.filter(p => p.isActive).map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name} ({project.projectType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!selectedCustomerId}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-contact">
                          <SelectValue placeholder="Select contact" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id.toString()}>
                            {contact.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="editorType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Editor Type</FormLabel>
                    <div className="flex gap-4 mt-2">
                      <Button
                        type="button"
                        variant={editorTypeSelection === "system" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setEditorTypeSelection("system");
                          field.onChange("system");
                        }}
                        data-testid="button-editor-system"
                      >
                        System Editor
                      </Button>
                      <Button
                        type="button"
                        variant={editorTypeSelection === "client" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setEditorTypeSelection("client");
                          field.onChange("client");
                        }}
                        data-testid="button-editor-client"
                      >
                        Client Editor
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {editorTypeSelection === "system" ? (
              <FormField
                control={form.control}
                name="editorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Editor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-editor">
                          <SelectValue placeholder="Select editor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {editors.filter(e => e.isActive).map((editor) => (
                          <SelectItem key={editor.id} value={editor.id.toString()}>
                            {editor.name} ({editor.editorType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientEditorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Editor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" data-testid="input-client-editor-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientEditorType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Editor Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger data-testid="select-client-editor-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="vfx">VFX</SelectItem>
                          <SelectItem value="colorist">Colorist</SelectItem>
                          <SelectItem value="di">DI</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientEditorPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 9876543210" data-testid="input-client-editor-phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientEditorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., john@example.com" data-testid="input-client-editor-email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bookingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input type="date" data-testid="input-booking-date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fromTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Time *</FormLabel>
                    <FormControl>
                      <Input type="time" data-testid="input-from-time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Time *</FormLabel>
                    <FormControl>
                      <Input type="time" data-testid="input-to-time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="actualFromTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual From</FormLabel>
                    <FormControl>
                      <Input type="time" data-testid="input-actual-from-time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actualToTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual To</FormLabel>
                    <FormControl>
                      <Input type="time" data-testid="input-actual-to-time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breakHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Break Hrs</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        data-testid="input-break-hours"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="tentative">Tentative</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes..."
                      className="resize-none"
                      data-testid="input-notes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!booking && (
              <FormField
                control={form.control}
                name="repeatDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat for Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0 for no repeat"
                        data-testid="input-repeat-days"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} data-testid="button-save-booking">
                {isPending ? "Saving..." : booking ? "Update Booking" : "Create Booking"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
